import { LoginRequest } from '@/@core/domain/entities/request/login.request'
import { BaseResponse } from '@/@core/domain/entities/response/base.response'
import { UserClient } from '@/@core/domain/entities/userclient'
import { AuthGateway } from '@/@core/domain/gateways/auth.gateway'
import { OrganizationGateway } from '@/@core/domain/gateways/organization.gateway'
import { UserLoginLocalStorageGateway } from '@/@core/infrastructure/gateways/userlogin-local.storage.gateway'

export class LoginUseCase {
  constructor(
    private authGate: AuthGateway,
    private userLoginGate: UserLoginLocalStorageGateway,
    private orgGate: OrganizationGateway
  ) {}

  async execute(request: LoginRequest): Promise<BaseResponse<UserClient>> {
    return this.authGate.login(request).then((resp) => {
      if (resp.data != null) {
        this.userLoginGate.store(resp.data)
        return this.orgGate.me().then((respOrg) => {
          if (respOrg.data != null) {
            this.userLoginGate.storeOrg(respOrg.data)
          }
          return resp
        })
      } else {
        return resp
      }
    })
  }
}
