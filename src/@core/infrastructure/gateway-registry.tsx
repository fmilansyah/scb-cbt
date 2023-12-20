import { Registry } from './container-registry'
import { AuthHttpGateway } from './gateways/auth-http.gateway'
import { UserLoginLocalStorageGateway } from './gateways/userlogin-local.storage.gateway'
import { ThemeConfigLocalStorageGateway } from './gateways/theme-config.local-storage.gateway'
import { Container } from 'inversify'
import { OrganizationHttpGateway } from './gateways/organization-http.gateway'
import { ExamHttpGateway } from './gateways/exam-http.gateway'

export const registryGateway = (container: Container) => {
  container.bind(Registry.AuthGateway).toDynamicValue((context) => {
    return new AuthHttpGateway(context.container.get(Registry.AxiosAdapter))
  })
  container
    .bind(Registry.UserLoginLocalStorageGateway)
    .to(UserLoginLocalStorageGateway)
  container
    .bind(Registry.ThemeConfigLocalStorageGateway)
    .to(ThemeConfigLocalStorageGateway)
    container.bind(Registry.OrganizationGateway).toDynamicValue((context) => {
      return new OrganizationHttpGateway(
        context.container.get(Registry.AxiosAdapter)
      )
    })
    container.bind(Registry.ExamGateway).toDynamicValue((context) => {
      return new ExamHttpGateway(
        context.container.get(Registry.AxiosAdapter)
      )
    })
}
