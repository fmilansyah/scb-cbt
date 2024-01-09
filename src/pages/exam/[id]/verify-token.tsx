import { ExamUseCase } from '@/@core/application/exam/exam.usecase'
import { Registry, container } from '@/@core/infrastructure/container-registry'
import { Button } from '@/components/Elements'
import { NetworkStatus } from '@/shared/constants/network'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function VerifyToken() {
  const router = useRouter()

  const [token, setToken] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const useCase = container.get<ExamUseCase>(Registry.ExamUseCase)

  const handleCheckToken = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const exec = await useCase.view(token, { exam_session_id: router?.query?.id as unknown as number })
    setLoading(false)
    if (exec.status === NetworkStatus.SUCCESS && exec.data !== null) {
      router.replace(`/exam/${router?.query?.id}/detail?token=${token}`)
    }
  }

  return (
    <>
      <div>
        <div className="overflow-x-auto">
          <h1 className="ltr:mr-3 rtl:ml-3 text-2xl font-bold">Kerjakan Ujian</h1>
        </div>
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <Link href="/" className="text-primary hover:underline">
              Daftar Ujian
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Verifikasi Token</span>
          </li>
        </ul>

        <div className="grid grid-cols-6 gap-4 mt-3">
          <div className="lg:col-start-2 lg:col-span-4 col-span-6">
            <div className="panel">
              <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Token Ujian</h5>
              </div>
              <div className="mb-5">
                <form onSubmit={handleCheckToken}>
                  <input type="text" placeholder="Masukkan Token" className="form-input" required value={token} onChange={({ target: { value } }) => setToken(value)} />
                  <Button htmlType="submit" className="mt-6" loading={loading}>Cek Token</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
