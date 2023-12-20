import { Organization } from '../entities/organization'
import { BaseResponse } from '../entities/response/base.response'

export interface OrganizationGateway {
  me(): Promise<BaseResponse<Organization>>
}
