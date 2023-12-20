import { Organization } from '@/@core/domain/entities/organization'
import { BaseResponse } from '@/@core/domain/entities/response/base.response'
import { OrganizationGateway } from '@/@core/domain/gateways/organization.gateway'
import { UserLoginGateway } from '@/@core/domain/gateways/user-login.gateway'

export class OrgUseCase {
  constructor(
    private gate: OrganizationGateway,
    private userLoginGate: UserLoginGateway
  ) {}

  async me(): Promise<BaseResponse<Organization>> {
    return this.gate.me().then((resp) => {
      if (resp.data != null) {
        this.userLoginGate.storeOrg(resp.data)
      }
      return resp
    })
  }
}
