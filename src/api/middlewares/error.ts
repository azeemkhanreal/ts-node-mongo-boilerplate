import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import httpStatus from "http-status";
import ApiError from "../../utils/ApiError";
import config from 'config';
import logger from '../../loader/logger';

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;

  if (config.get('env') === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.get('env') === 'development' && { stack: err.stack }),
  };

  if (config.get('env') === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export {
  errorConverter,
  errorHandler,
};
