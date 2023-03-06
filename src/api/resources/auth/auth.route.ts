import express from 'express';
import authController from './auth.controller';
import validate from '../../middlewares/validate';
import authSchema from './auth.schema';
const router = express.Router();

router.post('/login', validate(authSchema.login), authController.login)
router.post('/register', validate(authSchema.register), authController.register)
router.post('/logout', validate(authSchema.logout), authController.logout)
router.post('/refresh-token', validate(authSchema.refreshToken), authController.refreshToken)
router.post('/forgot-password', validate(authSchema.forgotPassword), authController.forgotPassword)
router.post('/reset-password', validate(authSchema.resetPassword), authController.resetPassword)
router.post('/send-verfication-email')
router.post('/verify-email')

export default router;
