import { ThemeConfig } from '@/@core/domain/entities/theme-config'
import { ThemeConfigGateway } from '@/@core/domain/gateways/theme-config.gateway'
import { StorageConst } from '@/shared/constants/storage'
import { injectable } from 'inversify'

@injectable()
export class ThemeConfigLocalStorageGateway implements ThemeConfigGateway {
  get(): ThemeConfig {
    const themeConfig: ThemeConfig = JSON.parse(
      localStorage.getItem(StorageConst.ThemeConfigKey) || '{}'
    )
    return themeConfig
  }

  store(themeConfig: ThemeConfig): void {
    localStorage.setItem(StorageConst.ThemeConfigKey, JSON.stringify(themeConfig))
  }

  toggleTheme(theme: string): void {
    const themeConfig: ThemeConfig = this.get()
    themeConfig.theme = theme
    if (theme === 'light') {
      themeConfig.isDarkMode = false
    } else if (theme === 'dark') {
      themeConfig.isDarkMode = true
    } else if (theme === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          themeConfig.isDarkMode = true
      } else {
          themeConfig.isDarkMode = false
      }
    }
    this.store(themeConfig)

    if (themeConfig.isDarkMode) {
      document.querySelector('body')?.classList.add('dark')
    } else {
      document.querySelector('body')?.classList.remove('dark')
    }
  }

  toggleMenu(menu: string): void {
    const themeConfig: ThemeConfig = this.get()
    themeConfig.sidebar = false
    themeConfig.menu = menu
    this.store(themeConfig)
  }

  toggleLayout(layout: string): void {
    const themeConfig: ThemeConfig = this.get()
    themeConfig.layout = layout
    this.store(themeConfig)
  }

  toggleRTL(rtlClass: string): void {
    const themeConfig: ThemeConfig = this.get()
    themeConfig.rtlClass = rtlClass
    this.store(themeConfig)
    document.querySelector('html')?.setAttribute('dir', rtlClass || 'ltr')
  }

  toggleAnimation(animation: string): void {
    const themeConfig: ThemeConfig = this.get()
    themeConfig.animation = animation?.trim()
    this.store(themeConfig)
  }

  toggleNavbar(navbar: string): void {
    const themeConfig: ThemeConfig = this.get()
    themeConfig.navbar = navbar
    this.store(themeConfig)
  }

  toggleSemidark(semidark: boolean): void {
    const themeConfig: ThemeConfig = this.get()
    themeConfig.semidark = semidark
    this.store(themeConfig)
  }

  toggleSidebar(): void {
    const themeConfig: ThemeConfig = this.get()
    themeConfig.sidebar = !themeConfig.sidebar
    this.store(themeConfig)
  }
}
