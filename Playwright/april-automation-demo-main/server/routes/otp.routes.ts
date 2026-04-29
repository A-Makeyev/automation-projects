import { Router } from 'express';
import { OtpController } from '../controllers/otp.controller';

const router = Router();
const otpController = new OtpController();

router.get('/', otpController.getOtp.bind(otpController));

export default router;
