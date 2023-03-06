import ApiError from "../../../utils/ApiError"
import User from "./user.model"
import httpStatus from "http-status"

const getAllUsers = async () => {
  return User.find();
}
const getUserById = async (id: string) => {
  return User.findById(id);
}
const findUserByEmail = (email: string) => {
  return User.findOne({ email });
}
const createUser = async (userBody: any) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return User.create(userBody);
}
const updateUserById = async (id: string, updateBody: object) => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if ((updateBody as any).email && (await User.isEmailTaken((updateBody as any).email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return await User.findOneAndUpdate({ _id: id }, updateBody, { new: true })
}
const deleteUserById = async (id: string) => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await User.deleteOne({ _id: id });
  return user;
}

const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
}

export default {
  getAllUsers,
  getUserById,
  findUserByEmail,
  createUser,
  updateUserById,
  deleteUserById,
  getUserByEmail
}
