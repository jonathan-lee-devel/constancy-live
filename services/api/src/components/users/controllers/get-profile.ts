import {Request, RequestHandler} from 'express';
import User from '../models/User';
import {HttpStatus} from '../../../lib/http/HttpStatus';
import requestMiddleware from '../../../middleware/request-middleware';
import logger from '../../../lib/logger/logger';

const getProfile: RequestHandler = async (req: Request, res) => {
  // @ts-ignore
  const {email} = req.user;
  logger.silly(`User profile to get: ${email}`);

  const user = await User.findOne({email}, {__v: 0, _id: 0});
  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).send({
      error: 'User not found',
    });
  }

  return res.status(HttpStatus.OK).send({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });
};

export default requestMiddleware(getProfile, {requiresAuthentication: true});
