import { Request, Response } from 'express';
import httpStatus from 'http-status';
import UserService from './user.service';
import ApiError from '../../../utils/ApiError';
import catchAsync from '../../../utils/catchAsync';

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.status(httpStatus.OK).send(users);
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.OK).send(user);
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.body;
  const newUser = await UserService.createUser(user);
  res.status(httpStatus.CREATED).send(newUser);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const updatedUser = await UserService.updateUserById(req.params.userId, req.body);
  res.status(httpStatus.OK).send(updatedUser);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).send({ message: 'User deleted successfully' });
});

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
