import { ExamUseCase } from '@/@core/application/exam/exam.usecase'
import { ExamDetail, ExamLsData } from '@/@core/domain/entities/exam'
import { Registry, container } from '@/@core/infrastructure/container-registry'
import BlankLayout from '@/components/Layouts/BlankLayout'
import { NetworkStatus } from '@/shared/constants/network'
import { Skeleton } from '@mantine/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ExamCbt from '@/modules/exam/cbt'
import { isKeyNotAvailable } from '@/shared/utils/formatter'
import dayjs from 'dayjs'

const Cbt = () => {
  const router = useRouter()
  const useCase = container.get<ExamUseCase>(Registry.ExamUseCase)

  // Menampung data dari api
  const [data, setData] = useState<ExamDetail>()
  // Menampung data dari local storage
  const [examLsData, setExamLsData] = useState<ExamLsData | null>(null)

  useEffect(() => {
    getExam()

    const timer = setTimeout(() => {
      openFullScreen()
    }, 2000);

    // Prevent fraud
    const handleKeydown = (e: any) => {
      e = e || window.event;
      if(e.keyCode == 116 || e.keyCode == 123){
        e.preventDefault();
      }
      if (e.ctrlKey) {
        let c = e.which || e.keyCode;
        if (c == 82) {
            e.preventDefault();
            e.stopPropagation();
        }
      }
    }
    const handlePreventDefault = (e: any) => {
      e.preventDefault();
    }
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener(
      "contextmenu",
      handlePreventDefault,
      false
    );
    document.addEventListener(
      "copy",
      handlePreventDefault,
      false
    );
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('contextmenu', handlePreventDefault);
      document.removeEventListener('copy', handlePreventDefault);
    }
  }, [])

  const openFullScreen = () => {
    let elem = document.getElementById('__next');
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  }

  const getExam = async () => {
    const exec = await useCase.view(router?.query?.token as string, { exam_session_id: router?.query?.id as unknown as number })
    if (exec.status === NetworkStatus.SUCCESS && exec.data !== null) {
      setData(exec?.data)

      // Simpan exam ke cookies jika belum ada atau berbeda token
      const newExamLsData = useCase.getExam()
      const params: ExamLsData = {
        token: router?.query?.token as string,
        exam_end_at: dayjs(exec?.data?.date, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY-MM-DD') + ' ' + exec?.data?.end_time,
        questions: (exec?.data?.questions ?? []).map((obj, index) => {
          const dataIndex: number = (newExamLsData?.questions ?? []).findIndex((exam) => exam?.question_id === obj?.id)
          return {
            time_left: dataIndex > -1 ? newExamLsData?.questions[dataIndex]?.time_left : obj.duration * 60000,
            opened: dataIndex > -1 ? newExamLsData?.questions[dataIndex]?.opened : index === 0,
            user_answers: dataIndex > -1 ? newExamLsData?.questions[dataIndex]?.user_answers : obj.user_answers,
            question_id: obj.id
          }
        }),
      }
      setExamLsData(params)
      useCase.saveExam(params)
    }
  }

  return (
    <div className="sm:p-5">
      {isKeyNotAvailable(data) || isKeyNotAvailable(examLsData) ? (
        <Skeleton />
      ) : (
        <ExamCbt data={data} examLsData={examLsData} />
      )}
    </div>
  )
}

Cbt.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>
}

export const getServerSideProps = () => {
  return {
    props: {
      page_title: 'CBT',
    },
  }
}

export default Cbt
