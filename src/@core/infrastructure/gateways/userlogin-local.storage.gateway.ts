import { Organization } from '@/@core/domain/entities/organization'
import { UserClient } from '@/@core/domain/entities/userclient'
import { UserLoginGateway } from '@/@core/domain/gateways/user-login.gateway'
import { StorageConst } from '@/shared/constants/storage'
import { injectable } from 'inversify'
import Cookies from 'js-cookie'

@injectable()
export class UserLoginLocalStorageGateway implements UserLoginGateway {
  get(): UserClient | null {
    const user: UserClient | null = JSON.parse(
      localStorage.getItem(StorageConst.UserKey) || '{}'
    )
    return user
  }

  getOrg(): Organization | null {
    const org: Organization | null = JSON.parse(
      localStorage.getItem(StorageConst.OrganizationKey) || '{}'
    )
    return org
  }

  store(user: UserClient): void {
    Cookies.set(StorageConst.UserKey, user?.token, {
      expires: 0.5,
    })
    localStorage.setItem(StorageConst.UserKey, JSON.stringify(user))
  }

  storeOrg(org: Organization): void {
    localStorage.setItem(StorageConst.OrganizationKey, JSON.stringify(org))
  }

  remove(): boolean {
    Cookies.remove(StorageConst.UserKey)
    localStorage.removeItem(StorageConst.UserKey)
    return true
  }
}
