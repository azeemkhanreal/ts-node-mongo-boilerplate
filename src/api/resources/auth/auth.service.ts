import httpStatus from "http-status"
import ApiError from "../../../utils/ApiError"
import { TokenTypes } from "../../../utils/constants"
import userService from "../user/user.service"
import Token from "./token.model"
import tokenService from "./token.service"

const loginUserWithEmailAndPassword = async (email: string, password: string) => {
  const user = await userService.getUserByEmail(email)
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user
}

const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TokenTypes.REFRESH)
    const user = await userService.getUserById(refreshTokenDoc.user)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await Token.deleteMany({ token: refreshToken, type: TokenTypes.REFRESH, user: user._id })
    return tokenService.generateAuthToken(user)
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid refresh token')
  }
}

const resetPassword = async (resetPasswordToken: string, password: string) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, TokenTypes.RESET_PASSWORD)
    const user = await userService.getUserById(resetPasswordTokenDoc.user)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    user.password = password
    await user.save()
    await Token.deleteMany({ user: user._id, type: TokenTypes.RESET_PASSWORD })
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid reset password token')
  }
}

const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TokenTypes.REFRESH)
  if (!refreshTokenDoc) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid refresh token')
  await Token.deleteOne({ token: refreshToken, type: TokenTypes.REFRESH, user: refreshTokenDoc.user })
}

export default {
  loginUserWithEmailAndPassword,
  refreshAuth,
  resetPassword,
  logout
}
