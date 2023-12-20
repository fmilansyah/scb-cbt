import { Organization } from '@/@core/domain/entities/organization'
import { BaseResponse } from '@/@core/domain/entities/response/base.response'
import { OrganizationGateway } from '@/@core/domain/gateways/organization.gateway'
import { NetworkService } from '@/shared/constants/network'
import { AxiosInstance } from 'axios'

export class OrganizationHttpGateway implements OrganizationGateway {
  constructor(private http: AxiosInstance) {
    http.defaults.headers.common[NetworkService.KEY] = NetworkService.CORE
  }
  async me(): Promise<BaseResponse<Organization>> {
    return this.http
      .get<BaseResponse<Organization>>('/auth/me/organization')
      .then((resp) => resp.data)
      .catch((err) => err.response.data)
  }
}
