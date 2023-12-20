import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/@core/domain/entities/request/forgot-password.request'
import { LoginRequest } from '@/@core/domain/entities/request/login.request'
import { BaseResponse } from '@/@core/domain/entities/response/base.response'
import { UserClient } from '@/@core/domain/entities/userclient'
import { AuthGateway } from '@/@core/domain/gateways/auth.gateway'
import { NetworkService } from '@/shared/constants/network'
import { AxiosInstance } from 'axios'

export class AuthHttpGateway implements AuthGateway {
  constructor(private http: AxiosInstance) {
    http.defaults.headers.common[NetworkService.KEY] = NetworkService.CORE
  }
  async login(request: LoginRequest): Promise<BaseResponse<UserClient>> {
    return this.http
      .post<BaseResponse<UserClient>>('/auth/login', request)
      .then((resp) => resp.data)
      .catch((err) => err.response.data)
  }
  async forgotPassword(
    request: ForgotPasswordRequest
  ): Promise<BaseResponse<string | null>> {
    return this.http
      .post<BaseResponse<string | null>>(
        '/auth/send-reset-password-link',
        request
      )
      .then((resp) => resp.data)
      .catch((err) => err.response.data)
  }
  async resetPassword(
    token: string,
    request: ResetPasswordRequest
  ): Promise<BaseResponse<string | null>> {
    return this.http
      .post<BaseResponse<string | null>>(
        `/auth/reset-password?token=${token}`,
        request
      )
      .then((resp) => resp.data)
      .catch((err) => err.response.data)
  }
}
