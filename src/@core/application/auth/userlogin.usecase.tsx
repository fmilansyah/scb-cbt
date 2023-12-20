import { Organization } from '@/@core/domain/entities/organization'
import { UserClient } from '@/@core/domain/entities/userclient'
import { UserLoginLocalStorageGateway } from '@/@core/infrastructure/gateways/userlogin-local.storage.gateway'

export class UserLoginUseCase {
  constructor(private userLoginGate: UserLoginLocalStorageGateway) {}
  execute(): UserClient | null {
    return this.userLoginGate.get()
  }
  executeOrg(): Organization | null {
    return this.userLoginGate.getOrg()
  }
}
