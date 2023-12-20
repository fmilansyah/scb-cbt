import { ThemeConfig } from '../entities/theme-config'

export interface ThemeConfigGateway {
  get(): ThemeConfig
  store(themeConfig: ThemeConfig): void
  toggleTheme(theme: string): void
  toggleMenu(menu: string): void
  toggleLayout(layout: string): void
  toggleRTL(rtlClass: string): void
  toggleAnimation(animation: string): void
  toggleNavbar(navbar: string): void
  toggleSemidark(semidark: boolean): void
  toggleSidebar(sidebar: boolean): void
}
