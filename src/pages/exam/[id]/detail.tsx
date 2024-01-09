import { ExamUseCase } from '@/@core/application/exam/exam.usecase'
import { ExamDetail } from '@/@core/domain/entities/exam'
import { Registry, container } from '@/@core/infrastructure/container-registry'
import { Skeleton } from '@/components/Elements'
import { NetworkStatus } from '@/shared/constants/network'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ViewExam from '@/modules/exam/view'

export default function VerifyToken() {
  const router = useRouter()

  const [data, setData] = useState<ExamDetail>()
  const [loading, setLoading] = useState<boolean>(true)

  const useCase = container.get<ExamUseCase>(Registry.ExamUseCase)

  useEffect(() => {
    if (!router.isReady) return
    getExam()
  }, [router.isReady])

  const getExam = async () => {
    setLoading(true)
    const exec = await useCase.view(router?.query?.token as string, { exam_session_id: router?.query?.id as unknown as number })
    setLoading(false)
    if (exec.status === NetworkStatus.SUCCESS && exec.data !== null) {
      setData(exec?.data)
    }
  }

  return (
    <>
      <div className="panel">
        {loading ? (
          <Skeleton />
        ) : (
          <ViewExam data={data} />
        )}
      </div>
    </>
  )
}
