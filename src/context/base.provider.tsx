import { UserLoginUseCase } from '@/@core/application/auth/userlogin.usecase'
import { ThemeConfigUseCase } from '@/@core/application/settings/theme-config.usecase'
import { Organization } from '@/@core/domain/entities/organization'
import { ThemeConfig } from '@/@core/domain/entities/theme-config'
import { UserClient } from '@/@core/domain/entities/userclient'
import { container, Registry } from '@/@core/infrastructure/container-registry'
import {
  PropsWithChildren,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react'

export type BaseContextType = {
  updateThemeConfig: (themeConfig: any) => void
  themeConfig: ThemeConfig
  user: UserClient | null
  org: Organization | null
  getUser: () => void
  getOrg: () => void
}

export const defaultContext: BaseContextType = {
  updateThemeConfig: (themeConfig: any) => themeConfig,
  themeConfig: {
    isDarkMode: false,
    sidebar: false,
    theme: 'light',
    menu: 'horizontal',
    layout: 'full',
    rtlClass: 'ltr',
    animation: '',
    navbar: 'navbar-sticky',
    semidark: false,
  },
  getUser: () => null,
  getOrg: () => null,
  user: null,
  org: null,
}

const userLoginUseCase = container.get<UserLoginUseCase>(
  Registry.AuthUserLoginUseCase
)

export const BaseContext = createContext(defaultContext)

export const BaseProvider = ({ children }: PropsWithChildren) => {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultContext.themeConfig)
  const [user, setUser] = useState<UserClient | null>(defaultContext.user)
  const [org, setOrg] = useState<Organization | null>(defaultContext.org)

  const themeConfigUseCase = container.get<ThemeConfigUseCase>(
    Registry.ThemeConfigUseCase
  )
  const getThemeConfig = () => {
    setThemeConfig(themeConfigUseCase.get())
  }

  useEffect(() => {
    getThemeConfig()
  }, [])

  const updateThemeConfig = (newThemeConfig: any) => {
    setThemeConfig({ ...themeConfig, ...newThemeConfig })
  }

  const getUser = useCallback(() => {
    setUser(userLoginUseCase.execute())
  }, [])
  const getOrg = useCallback(() => {
    setOrg(userLoginUseCase.executeOrg())
  }, [])

  useEffect(() => {
    getUser()
    getOrg()
  }, [getUser, getOrg])

  return (
    <BaseContext.Provider
      value={{
        updateThemeConfig,
        themeConfig,
        user,
        getUser,
        org,
        getOrg,
      }}
    >
      {children}
    </BaseContext.Provider>
  )
}
