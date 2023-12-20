import { Registry } from './container-registry'
import { Container } from 'inversify'
import { LoginUseCase } from '../application/auth/login.usecase'
import { UserLoginUseCase } from '../application/auth/userlogin.usecase'
import { LogoutUseCase } from '../application/auth/logout.usecase'
import { ForgotPasswordUseCase } from '../application/auth/forgot-password.usecase'
import { ThemeConfigUseCase } from '../application/settings/theme-config.usecase'
import { OrgUseCase } from '../application/organization/org.usecase'
import { ExamUseCase } from '../application/exam/exam.usecase'

export const registryUseCase = (container: Container) => {
  container.bind(Registry.AuthLoginUseCase).toDynamicValue((context) => {
    return new LoginUseCase(
      context.container.get(Registry.AuthGateway),
      context.container.get(Registry.UserLoginLocalStorageGateway),
      context.container.get(Registry.OrganizationGateway)
    )
  })
  container
    .bind(Registry.AuthForgotPasswordUseCase)
    .toDynamicValue((context) => {
      return new ForgotPasswordUseCase(
        context.container.get(Registry.AuthGateway)
      )
    })
  container.bind(Registry.AuthUserLoginUseCase).toDynamicValue((context) => {
    return new UserLoginUseCase(
      context.container.get(Registry.UserLoginLocalStorageGateway)
    )
  })
  container.bind(Registry.AuthLogoutUseCase).toDynamicValue((context) => {
    return new LogoutUseCase(
      context.container.get(Registry.UserLoginLocalStorageGateway)
    )
  })
  container.bind(Registry.ThemeConfigUseCase).toDynamicValue((context) => {
    return new ThemeConfigUseCase(
      context.container.get(Registry.ThemeConfigLocalStorageGateway)
    )
  })
  container.bind(Registry.OrganizationUseCase).toDynamicValue((context) => {
    return new OrgUseCase(
      context.container.get(Registry.OrganizationGateway),
      context.container.get(Registry.UserLoginLocalStorageGateway)
    )
  })
  container
    .bind(Registry.ExamUseCase)
    .toDynamicValue((context) => {
      return new ExamUseCase(
        context.container.get(Registry.ExamGateway)
      )
    })
}
