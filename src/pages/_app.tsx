import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Head from 'next/head'
import 'react-perfect-scrollbar/dist/css/styles.css'
import '@/styles/tailwind.css'
import { NextPage } from 'next'
import { BaseProvider } from '@/context/base.provider'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)

  const title = pageProps?.page_title
    ? pageProps?.page_title + ' - ' + process.env.APP_NAME
    : process.env.APP_NAME

  return (
    <BaseProvider>
      <Head>
        <title>{title}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {getLayout(<Component {...pageProps} />)}
    </BaseProvider>
  )
}

export default App
