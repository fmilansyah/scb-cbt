import { ThemeConfig } from '@/@core/domain/entities/theme-config'
import { ThemeConfigLocalStorageGateway } from '@/@core/infrastructure/gateways/theme-config.local-storage.gateway'

export class ThemeConfigUseCase {
  constructor(private themeConfigGate: ThemeConfigLocalStorageGateway) {}
  get(): ThemeConfig {
    return this.themeConfigGate.get()
  }
  store(themeConfig: ThemeConfig): void {
    return this.themeConfigGate.store(themeConfig)
  }
  toggleTheme(theme: string): void {
    return this.themeConfigGate.toggleTheme(theme)
  }
  toggleMenu(menu: string): void {
    return this.themeConfigGate.toggleMenu(menu)
  }
  toggleLayout(layout: string): void {
    return this.themeConfigGate.toggleLayout(layout)
  }
  toggleRTL(rtlClass: string): void {
    return this.themeConfigGate.toggleRTL(rtlClass)
  }
  toggleAnimation(animation: string): void {
    return this.themeConfigGate.toggleAnimation(animation)
  }
  toggleNavbar(navbar: string): void {
    return this.themeConfigGate.toggleNavbar(navbar)
  }
  toggleSemidark(semidark: boolean): void {
    return this.themeConfigGate.toggleSemidark(semidark)
  }
  toggleSidebar(): void {
    return this.themeConfigGate.toggleSidebar()
  }
}
