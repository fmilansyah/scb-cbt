import { useContext, useState } from 'react'
import IconSettings from '@/components/Icon/IconSettings'
import IconX from '@/components/Icon/IconX'
import IconSun from '@/components/Icon/IconSun'
import IconMoon from '@/components/Icon/IconMoon'
import IconLaptop from '@/components/Icon/IconLaptop'
import { BaseContext } from '@/context/base.provider'

const Setting = () => {
  const { themeConfig, updateThemeConfig } = useContext(BaseContext)
  const [showCustomizer, setShowCustomizer] = useState(false)

  return (
    <div>
      <div className={`${(showCustomizer && '!block') || ''} fixed inset-0 z-[51] hidden bg-[black]/60 px-4 transition-[display]`} onClick={() => setShowCustomizer(false)}></div>

      <nav
        className={`${
          (showCustomizer && 'ltr:!right-0 rtl:!left-0') || ''
        } fixed top-0 bottom-0 z-[51] w-full max-w-[400px] bg-white p-4 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-[right] duration-300 ltr:-right-[400px] rtl:-left-[400px] dark:bg-black`}
      >
        <button
          type="button"
          className="absolute top-0 bottom-0 my-auto flex h-10 w-12 cursor-pointer items-center justify-center bg-primary text-white ltr:-left-12 ltr:rounded-tl-full ltr:rounded-bl-full rtl:-right-12 rtl:rounded-tr-full rtl:rounded-br-full"
          onClick={() => setShowCustomizer(!showCustomizer)}
        >
          <IconSettings className="animate-[spin_3s_linear_infinite] w-5 h-5" />
        </button>

        <div className="perfect-scrollbar h-full overflow-y-auto overflow-x-hidden">
          <div className="relative pb-5 text-center">
            <button type="button" className="absolute top-0 opacity-30 hover:opacity-100 ltr:right-0 rtl:left-0 dark:text-white" onClick={() => setShowCustomizer(false)}>
                <IconX className="w-5 h-5" />
            </button>

            <h4 className="mb-1 dark:text-white">PENGATURAN TAMPILAN</h4>
            <p className="text-white-dark">Pengaturan tampilan ini akan disimpan pada penyimpanan browser anda.</p>
          </div>

          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">Mode Terang/Gelap</h5>
            <p className="text-xs text-white-dark">Tampilkan dalam mode terang, gelap, atau mengikuti pengaturan sistem.</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button type="button" className={`${themeConfig.theme === 'light' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => updateThemeConfig({ theme: 'light' })}>
                <IconSun className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                Terang
              </button>

              <button type="button" className={`${themeConfig.theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => updateThemeConfig({ theme: 'dark' })}>
                <IconMoon className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                Gelap
              </button>

              <button type="button" className={`${themeConfig.theme === 'system' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => updateThemeConfig({ theme: 'system' })}>
                <IconLaptop className="w-5 h-5 shrink-0 ltr:mr-2 rtl:ml-2" />
                Sistem
              </button>
            </div>
          </div>

          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">Tampilan Navigasi</h5>
            <p className="text-xs text-white-dark">Pilih tampilan navigasi yang anda inginkan.</p>
            {/* <div className="mt-3 grid grid-cols-3 gap-2">
              <button type="button" className={`${themeConfig.menu === 'horizontal' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => updateThemeConfig({ menu: 'horizontal' })}>
                Horisontal
              </button>

              <button type="button" className={`${themeConfig.menu === 'vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`} onClick={() => updateThemeConfig({ menu: 'vertical' })}>
                Vertikal
              </button>

              <button
                type="button"
                className={`${themeConfig.menu === 'collapsible-vertical' ? 'btn-primary' : 'btn-outline-primary'} btn`}
                onClick={() => updateThemeConfig({ menu: 'collapsible-vertical' })}
              >
                Dilipat
              </button>
            </div> */}
            <div className="mt-5 text-primary">
              <label className="mb-0 inline-flex">
                <input type="checkbox" className="form-checkbox" checked={themeConfig.semidark} onChange={(e) => updateThemeConfig({ semidark: e.target.checked })} />
                <span>Semi Gelap (Bilah Samping & Bilah Atas)</span>
              </label>
            </div>
          </div>

          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">Posisi Bilah Atas</h5>
            <p className="text-xs text-white-dark">Menempel di atas, mengambang, atau ikuti gulir.</p>
            <div className="mt-3 flex items-center gap-3 text-primary">
              <label className="mb-0 inline-flex">
                <input
                  type="radio"
                  checked={themeConfig.navbar === 'navbar-sticky'}
                  value="navbar-sticky"
                  className="form-radio"
                  onChange={() => updateThemeConfig({ navbar: 'navbar-sticky' })}
                />
                <span>Menempel</span>
              </label>
              <label className="mb-0 inline-flex">
                <input
                  type="radio"
                  checked={themeConfig.navbar === 'navbar-floating'}
                  value="navbar-floating"
                  className="form-radio"
                  onChange={() => updateThemeConfig({ navbar: 'navbar-floating' })}
                />
                <span>Mengambang</span>
              </label>
              <label className="mb-0 inline-flex">
                <input
                  type="radio"
                  checked={themeConfig.navbar === 'navbar-static'}
                  value="navbar-static"
                  className="form-radio"
                  onChange={() => updateThemeConfig({ navbar: 'navbar-static' })}
                />
                <span>Ikuti gulir</span>
              </label>
            </div>
          </div>

          <div className="mb-3 rounded-md border border-dashed border-white-light p-3 dark:border-[#1b2e4b]">
            <h5 className="mb-1 text-base leading-none dark:text-white">Transisi Perpindahan Halaman</h5>
            <p className="text-xs text-white-dark">Efek transisi ketika berpindah halaman.</p>
            <div className="mt-3">
              <select className="form-select border-primary text-primary" value={themeConfig.animation} onChange={(e) => updateThemeConfig({ animation: e.target.value })}>
                <option value=" ">Nonaktif</option>
                <option value="animate__fadeIn">Fade</option>
                <option value="animate__fadeInDown">Fade Down</option>
                <option value="animate__fadeInUp">Fade Up</option>
                <option value="animate__fadeInLeft">Fade Left</option>
                <option value="animate__fadeInRight">Fade Right</option>
                <option value="animate__slideInDown">Slide Down</option>
                <option value="animate__slideInLeft">Slide Left</option>
                <option value="animate__slideInRight">Slide Right</option>
                <option value="animate__zoomIn">Zoom In</option>
              </select>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Setting
