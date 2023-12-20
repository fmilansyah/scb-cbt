import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import IconCaretsDown from '@/components/Icon/IconCaretsDown'
import { BaseContext } from '@/context/base.provider'
import PerfectScrollbar from 'react-perfect-scrollbar'
import IconCaretDown from '../Icon/IconCaretDown'
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard'
import AnimateHeight from 'react-animate-height'
import IconMenuPages from '../Icon/Menu/IconMenuPages'
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation'

const Sidebar = () => {
  const router = useRouter()
  const [currentMenu, setCurrentMenu] = useState<string>('')
  const [errorSubMenu, setErrorSubMenu] = useState(false)
  const { themeConfig, updateThemeConfig } = useContext(BaseContext)

  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value
    })
  }

  useEffect(() => {
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]')
    if (selector) {
      selector.classList.add('active')
      const ul: any = selector.closest('ul.sub-menu')
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || []
        if (ele.length) {
          ele = ele[0]
          setTimeout(() => {
              ele.click()
          })
        }
      }
    }
  }, [])

  useEffect(() => {
    setActiveRoute()
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      updateThemeConfig({ sidebar: !themeConfig.sidebar })
    }
  }, [router.pathname, themeConfig.sidebar, updateThemeConfig])

  const setActiveRoute = () => {
    let allLinks = document.querySelectorAll('.sidebar ul a.active')
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i]
      element?.classList.remove('active')
    }
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]')
    selector?.classList.add('active')
  }

  return (
    <div className={themeConfig.semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${themeConfig.semidark ? 'text-white-dark' : ''}`}
      >
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img className="ml-[5px] w-8 flex-none" src="/assets/images/icon.png" alt="logo" />
              <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">Smart Clinic</span>
            </Link>

            <button
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
              onClick={() => updateThemeConfig({ sidebar: !themeConfig.sidebar })}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>

          <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              <li className="menu nav-item">
                <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                  <div className="flex items-center">
                    <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Dashboard</span>
                  </div>

                  <div className={currentMenu !== 'dashboard' ? '-rotate-90 rtl:rotate-90' : ''}>
                    <IconCaretDown />
                  </div>
                </button>

                <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
                  <ul className="sub-menu text-gray-500">
                    <li>
                      <Link href="/">Pendaftaran</Link>
                    </li>
                    <li>
                      <Link href="/">Kasir</Link>
                    </li>
                    <li>
                      <Link href="/">Perawat</Link>
                    </li>
                    <li>
                      <Link href="/">Dokter</Link>
                    </li>
                    <li>
                      <Link href="/">Farmasi</Link>
                    </li>
                  </ul>
                </AnimateHeight>
              </li>

              <li className="menu nav-item">
                <Link href="https://vristo.sbthemes.com" target="_blank" className="nav-link group">
                    <div className="flex items-center">
                        <IconMenuDocumentation className="shrink-0 group-hover:!text-primary" />
                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Level 1 No Sub</span>
                    </div>
                </Link>
              </li>

              <li className="menu nav-item">
                <button type="button" className={`${currentMenu === 'page' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('page')}>
                  <div className="flex items-center">
                    <IconMenuPages className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Level 1 Has Sub</span>
                  </div>

                  <div className={currentMenu !== 'page' ? '-rotate-90 rtl:rotate-90' : ''}>
                    <IconCaretDown />
                  </div>
                </button>

                <AnimateHeight duration={300} height={currentMenu === 'page' ? 'auto' : 0}>
                  <ul className="sub-menu text-gray-500">
                    <li>
                      <Link href="/pages/knowledge-base">Level 2 No Sub</Link>
                    </li>
                    <li className="menu nav-item">
                      <button
                        type="button"
                        className={`${
                          errorSubMenu ? 'open' : ''
                        } w-full before:h-[5px] before:w-[5px] before:rounded before:bg-gray-300 hover:bg-gray-100 ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] dark:hover:bg-gray-900`}
                        onClick={() => setErrorSubMenu(!errorSubMenu)}
                      >
                        Level 2 Has Sub
                        <div className={`${errorSubMenu ? '-rotate-90 rtl:rotate-90' : ''} ltr:ml-auto rtl:mr-auto`}>
                          <IconCaretsDown fill={true} className="h-4 w-4" />
                        </div>
                      </button>

                      <AnimateHeight duration={300} height={errorSubMenu ? 'auto' : 0}>
                        <ul className="sub-menu text-gray-500">
                          <li>
                            <a href="/pages/error404" target="_blank">
                              Level 3
                            </a>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>
                  </ul>
                </AnimateHeight>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar
