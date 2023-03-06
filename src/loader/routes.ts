import express from "express";
import UserRouter from "../api/resources/user/user.route";
import AuthRouter from "../api/resources/auth/auth.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/users",
    router: UserRouter,
  },
  {
    path: "/auth",
    router: AuthRouter,
  }
]

defaultRoutes.forEach(route => {
  router.use(route.path, route.router);
})


export default router;
