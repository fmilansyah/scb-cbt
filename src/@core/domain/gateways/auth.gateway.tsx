import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../entities/request/forgot-password.request'
import { LoginRequest } from '../entities/request/login.request'
import { BaseResponse } from '../entities/response/base.response'
import { UserClient } from '../entities/userclient'

export interface AuthGateway {
  login(request: LoginRequest): Promise<BaseResponse<UserClient>>
  forgotPassword(
    request: ForgotPasswordRequest
  ): Promise<BaseResponse<string | null>>
  resetPassword(
    token: string,
    request: ResetPasswordRequest
  ): Promise<BaseResponse<string | null>>
}
