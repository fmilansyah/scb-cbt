import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/@core/domain/entities/request/forgot-password.request'
import { BaseResponse } from '@/@core/domain/entities/response/base.response'
import { AuthGateway } from '@/@core/domain/gateways/auth.gateway'

export class ForgotPasswordUseCase {
  constructor(private authGate: AuthGateway) {}

  async execute(
    request: ForgotPasswordRequest
  ): Promise<BaseResponse<string | null>> {
    return this.authGate.forgotPassword(request).then((resp) => {
      return resp
    })
  }
  async reset(
    token: string,
    request: ResetPasswordRequest
  ): Promise<BaseResponse<string | null>> {
    return this.authGate.resetPassword(token, request).then((resp) => {
      return resp
    })
  }
}
