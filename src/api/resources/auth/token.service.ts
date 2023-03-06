import config from 'config';
import jwt from 'jsonwebtoken';
import { TokenTypes } from '../../../utils/constants';
import moment from 'moment';
import Token from './token.model';
import userService from '../user/user.service';
import ApiError from '../../../utils/ApiError';
import httpStatus from 'http-status';

const saveToken = async (token: string, userId: string, expires: moment.Moment, type: string, blacklisted = false) => {
  const tokenDoc = {
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted
  }

  await Token.create(tokenDoc)
  return tokenDoc
}

const generateAuthToken = async (user: any) => {
  const accessTokenExpires = moment().add(config.get<number>('jwt.accessExpirationMinutes'), 'minutes')
  const accessToken = generateToken(user.id, accessTokenExpires, TokenTypes.ACCESS)
  const refreshTokenExpires = moment().add(config.get<number>('jwt.refreshExpirationDays'), 'days')
  const refreshToken = generateToken(user.id, refreshTokenExpires, TokenTypes.REFRESH)

  await saveToken(refreshToken, user.id, refreshTokenExpires, TokenTypes.REFRESH)

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires
    }
  }
}

const verifyToken = async (token: string, type: string) => {
  const payload = jwt.verify(token, config.get<string>('jwt.secret')) as jwt.JwtPayload
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false
  })
  if (!tokenDoc) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found')
  }
  return tokenDoc
}

const generateToken = (userId: string, expires: moment.Moment, type: string, secret = config.get<string>('jwt.secret')) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const generateResetPasswordToken = async (email: string) => {
  const user = await userService.getUserByEmail(email)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email')
  }
  const expires = moment().add(config.get<number>('jwt.resetExpirationMinutes'), 'minutes')
  const resetPasswordToken = generateToken(user.id, expires, TokenTypes.RESET_PASSWORD)

  await saveToken(resetPasswordToken, user.id, expires, TokenTypes.RESET_PASSWORD)
  return resetPasswordToken
}


export default {
  generateAuthToken,
  verifyToken,
  generateResetPasswordToken
}
