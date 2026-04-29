import { Request, Response } from 'express';
import { OtpService } from '../services/otp.service';

const otpService = new OtpService();

export class OtpController {
  public getOtp(req: Request, res: Response): void {
    try {
      const length = req.query.length ? parseInt(req.query.length as string, 10) : 6;
      const otp = otpService.generateOtp(isNaN(length) ? 6 : length);
      
      res.status(200).json({
        success: true,
        otp,
        message: 'OTP generated successfully',
      });
    } catch (error) {
      console.error('Error generating OTP:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
