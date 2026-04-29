import { APIRequestContext } from "@playwright/test";

export class LoginService {
    constructor(private readonly request: APIRequestContext) {}
    private readonly otpEndpoint: string = 'http://localhost:3000/api/otp'

    async getOTP(): Promise<string | null> {
        try {
            const response = await this.request.get(this.otpEndpoint)
            const body = await response.json()
            return body.otp
        } catch(error) {
            console.error('Server unavailable. Please use "npm run start" before calling otp api.')
            return null
        }
    }
}