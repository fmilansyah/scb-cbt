import { Organization } from '../entities/organization'
import { UserClient } from '../entities/userclient'

export interface UserLoginGateway {
  store(user: UserClient): void
  storeOrg(org: Organization): void
  get(): UserClient | null
  remove(): boolean
}
