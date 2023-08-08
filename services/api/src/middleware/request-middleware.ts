import {
  RequestHandler, Request, Response, NextFunction,
} from 'express';
import Joi from 'joi';
import BadRequest from '../errors/bad-request';
import {HttpStatus} from '../lib/http/HttpStatus';
import logger from '../lib/logger/logger';

/**
 * Helper to get message from Joi
 * @param {Joi.ValidationError} error Error form Joi
 * @return {any} Message from Joi, if available
 */
const getMessageFromJoiError = (error: Joi.ValidationError): string | undefined => {
  if (!error.details && error.message) {
    return error.message;
  }
  return error.details && error.details.length > 0 && error.details[0].message ?
    `PATH: [${error.details[0].path}] ;; MESSAGE: ${error.details[0].message}` : undefined;
};

interface HandlerOptions {
  validation?: {
    body?: Joi.ObjectSchema
  }
  requiresAuthentication: boolean;
};

/**
 * This router wrapper catches any error from async await
 * and throws it to the default express error handler,
 * instead of crashing the app
 * @param {RequestHandler} handler Request handler to check for error
 * @param {HandlerOptions} options options provided to the request middleware
 * @return {any} request middleware
 */
export const requestMiddleware = (
    handler: RequestHandler,
    options: HandlerOptions,
): RequestHandler => async (req: Request, res: Response, next: NextFunction) => {
  if (options.requiresAuthentication && !req.user) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }
  if (options.validation?.body) {
    const {error} = options.validation?.body.validate(req.body);
    if (error != null) {
      next(new BadRequest(getMessageFromJoiError(error)));
      return;
    }
  }

  try {
    handler(req, res, next);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      logger.log({
        level: 'error',
        message: 'Error in request handler',
        error: err,
      });
    }
    next(err);
  }
};

export default requestMiddleware;
