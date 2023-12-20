import { PropsWithChildren, useContext, useEffect } from 'react'
import { Registry, container } from '@/@core/infrastructure/container-registry'
import { ThemeConfigUseCase } from '@/@core/application/settings/theme-config.usecase'
import { BaseContext } from '@/context/base.provider'

function App({ children }: PropsWithChildren) {
  const { themeConfig } = useContext(BaseContext)
  const useCase = container.get<ThemeConfigUseCase>(Registry.ThemeConfigUseCase)

  useEffect(() => {
    useCase.toggleTheme(themeConfig.theme)
    useCase.toggleMenu(themeConfig.menu)
    useCase.toggleLayout(themeConfig.layout)
    useCase.toggleRTL(themeConfig.rtlClass)
    useCase.toggleAnimation(themeConfig.animation)
    useCase.toggleNavbar(themeConfig.navbar)
    useCase.toggleSemidark(themeConfig.semidark)
  }, [
    themeConfig.theme,
    themeConfig.menu,
    themeConfig.layout,
    themeConfig.rtlClass,
    themeConfig.animation,
    themeConfig.navbar,
    themeConfig.semidark
  ])

  return (
    <div
      className={`${(themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${
        themeConfig.rtlClass
      } main-section relative font-nunito text-sm font-normal antialiased`}
    >
      {children}
    </div>
  )
}

export default App
