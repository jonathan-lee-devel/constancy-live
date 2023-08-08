import express, {NextFunction, Request, Response} from 'express';
import createError from 'http-errors';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import {Strategy as LocalStrategy} from 'passport-local';
import bcrypt from 'bcrypt';
import {HydratedDocument} from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';
import {HttpStatus} from './lib/http/HttpStatus';
import axios, {isAxiosError} from 'axios';
import User from './components/users/models/User';
import logger from './lib/logger/logger';

const result = dotenv.config();
if (result.error) {
  dotenv.config({path: '.env.default'});
}

const app = express();

/**
 * Log response time.
 * @param {Request} req request for response time to be logged
 * @param {Response} res response for response time to be logged
 * @param {NextFunction} next next function to be called
 */
function logResponseTime(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
    logger.log({
      level: 'debug',
      message,
      consoleLoggerOptions: {label: 'API'},
    });
  });

  next();
}

app.use(helmet.hidePoweredBy());
app.use(logResponseTime);
const frontEndUrl = process.env.FRONT_END_URL ?? undefined;
app.use(cors({
  credentials: true,
  optionsSuccessStatus: 200,
  origin: frontEndUrl,
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// @ts-ignore
app.use(cookieParser());
const sessionSecret = process.env.SESSION_SECRET ?? undefined;
if (!sessionSecret) {
  throw new Error('Session secret must be defined');
}
// @ts-ignore
app.use(expressSession({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));
const GoogleStrategy = passportGoogle.Strategy;
const googleClientId = process.env.GOOGLE_CLIENT_ID ?? undefined;
if (!googleClientId) {
  throw new Error('Google client ID must be defined');
}
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? undefined;
if (!googleClientSecret) {
  throw new Error('Google client secret must be defined');
}
const configurePassport = (): passport.PassportStatic => {
  passport.use('google', new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      },
      async (
          accessToken: string,
          refreshToken: string,
          profile: passportGoogle.Profile,
          done: passportGoogle.VerifyCallback,
      ): Promise<void> => {
        const existingUser = await User.findOne({email: profile.emails?.[0].value}).exec();
        if (existingUser?.emailVerified) {
          if (existingUser.googleId === profile.id) {
            done(null, existingUser);
            return;
          }
          existingUser.googleId = profile.id;
          existingUser.emailVerified = true;
          await existingUser.save();
          done(null, existingUser);
          return;
        }
        const newUser = await User.create({
          email: profile.emails?.[0].value,
          googleId: profile.id,
          password: undefined,
          firstName: profile.displayName,
          lastName: undefined,
          emailVerified: true,
        });
        done(null, newUser);
      },
  ));
  passport.use('local', new LocalStrategy(async (username, password, done): Promise<void> => {
    try {
      // @ts-ignore
      const foundUser: HydratedDocument<IUser> = await User.findOne({email: username}).exec();

      if (!foundUser) {
        return done(null, false, {message: 'Invalid username'});
      }

      if (!foundUser.password) {
        return done(null, false, {message: 'User is not registered via e-mail'});
      }

      if (!foundUser.emailVerified) {
        return done(null, false, {message: 'User\'s e-mail not verified'});
      }

      const validPassword = await bcrypt.compare(password, foundUser.password);
      if (!validPassword) {
        return done(null, false, {message: 'Invalid password'});
      }

      return done(null, foundUser);
    } catch (err) {
      if (err) return done(err);
    }
    return done(new Error('Unrecognized state'));
  }));


  // @ts-ignore
  passport.serializeUser((user: any, done: Function) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done: Function): Promise<void> => {
    User.findById(id).exec()
        .then((user: any) => {
          done(null, user);
        })
        .catch((reason: any) => {
          done(reason, null);
        });
  });
  return passport;
};

const configuredPassport: passport.PassportStatic = configurePassport();
// @ts-ignore
app.use(configuredPassport.initialize());
app.use(configuredPassport.session());

app.use(routes);

app.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
}));

app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  // @ts-ignore
  logger.info(`Successful Google authentication for: <${req.user.email}>`);
  res.redirect(`${frontEndUrl}/google-login-success`);
});

app.post('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      logger.error(`An error has occurred during logout for user: ${req.user}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({logoutStatus: 'FAILURE'});
    }
  });
  return res.status(HttpStatus.OK).json({logoutStatus: 'SUCCESS'});
});

// Root 200 OK for Cypress server health-check
app.get('/', (_req, res, _next) => res.status(200).send());

app.use((_req, _res, next) => {
  next(createError(404));
});

app.use(
    (
        err: { message: string; status: string },
        req: any,
        res: {
        locals: { message: any; error: any };
        status: (arg0: any) => void;
        json: (arg0: { error: any }) => void;
    },
        _: any,
    ) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      logger.error(
          `Error at ${req.url}: {"status":"${err.status}", "message":"${err.message}"}`,
      );
      res.status(err.status || 500);
      res.json({error: err});
    },
);

axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (isAxiosError(error)) {
        // @ts-ignore
        logger.error(`Axios Error: ${error.errors}`);
      }
      return Promise.reject(error);
    },
);

export default app;
