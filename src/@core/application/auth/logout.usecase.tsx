import { UserLoginLocalStorageGateway } from '@/@core/infrastructure/gateways/userlogin-local.storage.gateway'
export class LogoutUseCase {
  constructor(private userLoginGate: UserLoginLocalStorageGateway) {}

  execute(): boolean {
    return this.userLoginGate.remove()
  }
}
