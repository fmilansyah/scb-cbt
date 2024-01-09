import { LogoutUseCase } from "@/@core/application/auth/logout.usecase"
import { Registry, container } from "@/@core/infrastructure/container-registry"
import BlankLayout from "@/components/Layouts/BlankLayout"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Logout = () => {
  const router = useRouter()

  useEffect(() => {
    handleLogout()
  }, [])

  const handleLogout = async () => {
    const loginUseCase = container.get<LogoutUseCase>(Registry.AuthLogoutUseCase)
    await loginUseCase.execute()
    await router.replace('/auth/login')
  }

  return 'Harap tunggu ...'
}

Logout.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>
}

export const getStaticProps = () => {
  return {
    props: {
      page_title: 'Keluar',
    },
  }
}

export default Logout
