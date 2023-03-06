import express, { Request } from "express";
import cors from 'cors';
import config from 'config'
import routes from "./routes";
import helmet from 'helmet'
import compression from 'compression'
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { errorConverter, errorHandler } from "../api/middlewares/error";
import passport from "passport";
import jwtStrategy from "./passport";
import morgan from "./morgan";

export default ({ app }: { app: express.Application }) => {
  app.enable('trust proxy')
  app.use(cors())
  app.options('*', cors())
  app.use(express.json())
  app.use(express.static("/src/public"))
  app.use(express.urlencoded({ extended: true }))

  app.use(morgan.errorHandler)
  app.use(morgan.successHandler)

  app.use(helmet()) // set security HTTP headers
  app.use(compression()) // compress requests

  // jwt authentication
  app.use(passport.initialize());
  passport.use('jwt', jwtStrategy)

  app.use(config.get('api.prefix'), routes)


  // send back a 404 error for any unknown api request
  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  // convert error to ApiError, if needed
  app.use(errorConverter);

  // handle error
  app.use(errorHandler);
}
