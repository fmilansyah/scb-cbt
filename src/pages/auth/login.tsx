import BlankLayout from '@/components/Layouts/BlankLayout'
import Link from 'next/link'
import IconLockDots from '@/components/Icon/IconLockDots'
import IconUser from '@/components/Icon/IconUser'
import { useState } from 'react'
import { Registry, container } from '@/@core/infrastructure/container-registry'
import { LoginUseCase } from '@/@core/application/auth/login.usecase'
import { NetworkStatus } from '@/shared/constants/network'

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const submitForm = async (e: any) => {
    e.preventDefault()
    if (loading) {
      return
    }
    setLoading(true)
    const loginUseCase = container.get<LoginUseCase>(Registry.AuthLoginUseCase)
    const exec = await loginUseCase.execute({
      username: username,
      password: password,
    })
    setLoading(false)
    if (exec.status === NetworkStatus.SUCCESS && exec.data !== null) {
      window.document.location = '/'
    }
  }

  return (
    <div>
      <div className="absolute inset-0">
        <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
        <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
        <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
        <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
        <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
        <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
          <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
              <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
              <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                  <Link href="/" className="ms-10 block w-48 lg:w-72">
                      <img src="/logo.png" alt="Logo" className="w-full" />
                  </Link>
                  <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                      <img src="/assets/images/auth/login.svg" alt="Cover Image" className="w-full" />
                  </div>
              </div>
          </div>
          <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
            <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
              <Link href="/" className="block w-8 lg:hidden">
                <img src="/icon.png" alt="Icon" className="mx-auto w-10" />
              </Link>
            </div>
            <div className="w-full max-w-[440px] lg:mt-16">
              <div className="mb-10">
                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Masuk</h1>
                <p className="text-base font-bold leading-normal text-white-dark">Masukkan nama pengguna dan kata sandi anda</p>
              </div>
              <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                <div>
                  <label htmlFor="username">Nama Pengguna</label>
                  <div className="relative text-white-dark">
                    <input id="username" name="username" type="text" onChange={({ target: { value } }) => setUsername(value)} placeholder="Ketik di sini" className="form-input ps-10 placeholder:text-white-dark" required />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                      <IconUser fill={true} />
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="password">Kata Sandi</label>
                  <div className="relative text-white-dark">
                    <input id="password" name="password" type="password" onChange={({ target: { value } }) => setPassword(value)} placeholder="Ketik di sini" className="form-input ps-10 placeholder:text-white-dark" required />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                      <IconLockDots fill={true} />
                    </span>
                  </div>
                </div>
                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]" disabled={loading}>
                  {loading && (
                    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                  )}
                  Masuk
                </button>
              </form>

              <div className="mt-5 text-center dark:text-white">
                Lupa kata sandi?
                <Link href="/auth/forgot-password" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                  Atur ulang kata sandi
                </Link>
              </div>
            </div>
            <p className="absolute bottom-6 w-full text-center dark:text-white">Hak Cipta &copy; 2023. PT Qelopak Teknologi Indonesia</p>
          </div>
        </div>
      </div>
    </div>
  )
}

Login.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>
}

export const getStaticProps = () => {
  return {
    props: {
      page_title: 'Masuk',
    },
  }
}

export default Login
