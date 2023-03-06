import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import userService from "../user/user.service";
import authService from "./auth.service";
import tokenService from "./token.service";
import httpStatus from "http-status";

const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.createUser(req.body)
  const token = await tokenService.generateAuthToken(user)
  res.status(201).send({ user, token })
})

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  const user = await authService.loginUserWithEmailAndPassword(email, password)
  const token = await tokenService.generateAuthToken(user)

  res.send({ user, token })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await authService.logout(req.body.refreshToken)
  res.status(httpStatus.OK).send({ message: 'Logged out successfully' })
})

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body
  const token = await authService.refreshAuth(refreshToken)
  res.send({ token })
})

const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email)
  res.send({ resetPasswordToken })
})

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await authService.resetPassword(req.body.token, req.body.password)
  res.status(httpStatus.OK).send({ message: 'Password reset successfully' })
})

const sendVerificationEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => { })

const verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => { })

export default {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
}
