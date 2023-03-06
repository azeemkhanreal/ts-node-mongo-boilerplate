import passport from 'passport'
import { Request, Response, NextFunction } from 'express'
import ApiError from '../../utils/ApiError';
import httpStatus from 'http-status';
import { roleRights } from '../../utils/constants';

const verifyCallback = (req: Request, resolve: any, reject: any, requiredRights: string[]) => async (err: any, user: any, info: any) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, info?.message || 'Please authenticate'));
  }

  req.user = user

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role) || [];

    const hasRequiredRights = requiredRights.every(requiredRight => userRights.includes(requiredRight))

    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve()
}

const auth = (...requiredRights: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next)
  })
    .then(() => next())
    .catch((err) => next(err));
}

export default auth
