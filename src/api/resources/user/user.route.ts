import { Router } from "express";
import userController from "./user.controller";
import validate from "../../middlewares/validate";
import userValidation from "./user.schema";
import auth from "../../middlewares/auth";

const router = Router();

router.route("/")
  .get(auth(), userController.getUsers)
  .post(validate(userValidation.createUser), userController.createUser)

router.route("/:userId")
  .get(validate(userValidation.getUser), userController.getUser)
  .put(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser)

const UserRouter = router;
export default UserRouter;
