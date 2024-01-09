import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Dropdown from '../Dropdown';
import IconMenu from '@/components/Icon/IconMenu';
import IconSun from '@/components/Icon/IconSun';
import IconMoon from '@/components/Icon/IconMoon';
import IconLaptop from '@/components/Icon/IconLaptop';
// import IconUser from '@/components/Icon/IconUser';
import IconLogout from '@/components/Icon/IconLogout';
import { BaseContext } from '@/context/base.provider';
import IconBellBing from '../Icon/IconBellBing';
import IconInfoCircle from '../Icon/IconInfoCircle';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';

const Header = () => {
  const router = useRouter()

  const baseContext = useContext(BaseContext)

  useEffect(() => {
    const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]')
    if (selector) {
      const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active')
      for (let i = 0; i < all.length; i++) {
        all[0]?.classList.remove('active')
      }

      let allLinks = document.querySelectorAll('ul.horizontal-menu a.active')
      for (let i = 0; i < allLinks.length; i++) {
        const element = allLinks[i];
        element?.classList.remove('active')
      }
      selector?.classList.add('active')

      const ul: any = selector.closest('ul.sub-menu')
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link')
        if (ele) {
          ele = ele[0]
          setTimeout(() => {
            ele?.classList.add('active')
          })
        }
      }
    }
  }, [router.pathname])

  const { themeConfig, updateThemeConfig } = useContext(BaseContext)

  const isRtl = themeConfig.rtlClass === 'rtl' ? true : false

  return (
    <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
      <div className="shadow-sm">
        <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img className="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/icon.png" alt="Icon" />
              <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">{process.env.APP_NAME}</span>
            </Link>
            <button
              type="button"
              className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
              onClick={() => updateThemeConfig({ sidebar: !themeConfig.sidebar })}
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>

          <div className="hidden ltr:mr-2 rtl:ml-2 sm:block">
            <span className="align-middle text-2xl font-semibold transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light">|</span>
          </div>

          <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
            <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
              <div className="hidden md:inline">
                <span className="align-middle text-base font-semibold transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light">{baseContext?.org?.name}</span>
                <br />
                <span className="align-middle text-xs transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 text-white-dark">Tlp. : {baseContext?.org?.data?.phone}</span>
              </div>
            </div>
            <div>
              {themeConfig.theme === 'light' ? (
                <button
                  className={`${themeConfig.theme === 'light' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => updateThemeConfig({ theme: 'dark' })}
                  title="Mode Terang"
                >
                  <IconSun />
                </button>
              ) : (
                ''
              )}
              {themeConfig.theme === 'dark' && (
                <button
                  className={`${themeConfig.theme === 'dark' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => updateThemeConfig({ theme: 'system' })}
                  title="Mode Gelap"
                >
                  <IconMoon />
                </button>
              )}
              {themeConfig.theme === 'system' && (
                <button
                  className={`${themeConfig.theme === 'system' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => updateThemeConfig({ theme: 'light' })}
                  title="Ikuti Sistem"
                >
                  <IconLaptop />
                </button>
              )}
            </div>
            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                  <span>
                    <IconBellBing />
                    {/* <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                      <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                      <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                    </span> */}
                  </span>
                }
              >
                <ul className="w-[300px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px]">
                  <li onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-4 py-2 font-semibold">
                      <h4 className="text-lg">Notifikasi</h4>
                    </div>
                  </li>
                  <li onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
                      <div className="mx-auto mb-4 rounded-full ring-4 ring-primary/30">
                        <IconInfoCircle fill={true} className="h-10 w-10 text-primary" />
                      </div>
                      Tidak Ada Data
                    </button>
                  </li>
                </ul>
              </Dropdown>
            </div>

            <div className="dropdown flex shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative group block"
                button={<img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/user-profile.jpeg" alt="User Profile Picture" />}
              >
                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                  <li>
                    <div className="flex items-center px-4 py-4">
                      <img className="h-10 w-10 rounded-md object-cover" src="/assets/images/user-profile.jpeg" alt="User Profile Picture" />
                      <div className="truncate ltr:pl-4 rtl:pr-4">
                        <h4 className="text-base overflow-hidden text-ellipsis">
                          {baseContext?.user?.detail?.name}
                        </h4>
                        <span className="text-primary dark:text-dark-light/60 dark:hover:text-white">
                          {baseContext?.user?.detail?.code}
                        </span>
                      </div>
                    </div>
                  </li>
                  {/* <li>
                    <Link href="/users/profile" className="dark:hover:text-white">
                      <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                      Pengaturan Profil
                    </Link>
                  </li> */}
                  <li className="border-t border-white-light dark:border-white-light/10">
                    <Link href="/auth/logout" className="!py-3 text-danger">
                      <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                      Keluar
                    </Link>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>

        <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-6 font-semibold text-black rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-1.5 xl:space-x-8">
          <li className="menu nav-item relative">
            <Link href="/" className="nav-link">
              <div className="flex items-center">
                <IconMenuDashboard className="shrink-0" />
                <span className="px-1">Dashboard</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
