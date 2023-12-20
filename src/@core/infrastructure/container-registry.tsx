import 'reflect-metadata'
import { Container } from 'inversify'
import { http } from './http'
import { registryGateway } from './gateway-registry'
import { registryUseCase } from './usecase-registry'

export const Registry = {
  AxiosAdapter: Symbol.for('AxiosAdapter'),

  // GATEWAY
  AuthGateway: Symbol.for('AuthGateway'),
  UserLoginLocalStorageGateway: Symbol.for('UserLocalStorageGateway'),
  ThemeConfigLocalStorageGateway: Symbol.for('ThemeConfigLocalStorageGateway'),
  OrganizationGateway: Symbol.for('OrganizationGateway'),
  ExamGateway: Symbol.for('ExamGateway'),

  // USE CASES
  AuthLoginUseCase: Symbol.for('AuthLoginUseCase'),
  AuthForgotPasswordUseCase: Symbol.for('AuthForgotPasswordUseCase'),
  AuthLogoutUseCase: Symbol.for('AuthLogoutUseCase'),
  AuthUserLoginUseCase: Symbol.for('AuthUserLoginUseCase'),
  ThemeConfigUseCase: Symbol.for('ThemeConfigUseCase'),
  OrganizationUseCase: Symbol.for('OrganizationUseCase'),
  ExamUseCase: Symbol.for('ExamUseCase'),
}

export const container = new Container()
//########## HTTP
container.bind(Registry.AxiosAdapter).toConstantValue(http)
registryGateway(container)
registryUseCase(container)
