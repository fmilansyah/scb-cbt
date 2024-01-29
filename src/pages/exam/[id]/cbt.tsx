import { ExamUseCase } from '@/@core/application/exam/exam.usecase'
import { ExamDetail, Questions, SendViolationEventRequest } from '@/@core/domain/entities/exam'
import { Registry, container } from '@/@core/infrastructure/container-registry'
import BlankLayout from '@/components/Layouts/BlankLayout'
import { NetworkStatus } from '@/shared/constants/network'
import { Skeleton } from '@mantine/core'
import { useRouter } from 'next/router'
import {
  useContext,
  useEffect,
  useState
} from 'react'
import ExamCbt from '@/modules/exam/cbt'
import { isKeyNotAvailable } from '@/shared/utils/formatter'
import { socket } from '@/@core/infrastructure/socket'
import { md5 } from '@/shared/utils/encryption'
import { BaseContext } from '@/context/base.provider'
import { getViolationData } from '@/shared/utils/violation-event'
import { ViolationEventCode } from '@/shared/constants/enums'
import Swal from 'sweetalert2'

const toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  showCloseButton: true,
  customClass: {
    popup: `color-warning`,
  },
});

const Cbt = () => {
  const router = useRouter()
  const baseContext = useContext(BaseContext)
  const useCase = container.get<ExamUseCase>(Registry.ExamUseCase)

  // Menampung data dari api
  const [data, setData] = useState<ExamDetail>()
  // Menampung data dari local storage
  const [questions, setQuestions] = useState<Questions[]>([])

  useEffect(() => {
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
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('contextmenu', handlePreventDefault);
      document.removeEventListener('copy', handlePreventDefault);
    }
  }, [])

  useEffect(() => {
    if (!router.isReady) return

    socket.io.opts.query = { token: md5(String(baseContext?.user?.detail?.id)) }
    socket.connect()

    const onBlocked = async () => {
      const violationData = getViolationData(ViolationEventCode.Enum.MULTI_LOGIN)
      const params: SendViolationEventRequest = {
        exam_session_id: parseInt(router?.query?.id as string),
        exam_session_detail_id: parseInt(router?.query?.exam_session_detail_id as string),
        code: violationData.code,
        event_name: violationData.name,
        description: violationData.description,
      }
      const exec = await useCase.sendViolationEvent(params)
      if (exec?.status === NetworkStatus.SUCCESS) {
        toast.fire({
          title: params.description ?? '',
        });
      }
      await router.replace('/forbidden')
    }

    socket.on('blocked', onBlocked)

    return () => {
      socket.off('blocked', onBlocked)
      socket.disconnect()
    }
  }, [router.isReady])

  useEffect(() => {
    getExam()
  }, [router.query])

  const getExam = async () => {
    const examSessionDetailId = router?.query?.exam_session_detail_id as unknown as string
    const exec = await useCase.viewQuestion({
      exam_detail_id: router?.query?.exam_detail_id as unknown as number,
      exam_session_detail_id: parseInt(examSessionDetailId),
    })
    const examDetail = await useCase.view(router?.query?.token as string, { exam_session_id: router?.query?.id as unknown as number })
    // const examDetail = useCase.getExam()
    if (
      exec.status === NetworkStatus.SUCCESS &&
      examDetail.status === NetworkStatus.SUCCESS &&
      exec.data !== null &&
      examDetail.data !== null
    ) {
      const newExamDetail = {
        ...examDetail.data,
        question_packages: (examDetail?.data?.question_packages ?? []).map((q, index) => ({
          ...q,
          time_left: isKeyNotAvailable(q.time_left) ? q.duration * 1000 : q.time_left,
          opened: isKeyNotAvailable(q.opened) ? (index === 0 ? 1 : 0) : q.opened
        })),
      }
      setData(newExamDetail)

      setQuestions(exec?.data ? (exec?.data ?? []).map((obj, index) => ({
        ...obj,
        time_left: isKeyNotAvailable(obj.time_left) ? obj.duration * 1000 : obj.time_left,
        opened: isKeyNotAvailable(obj.opened) ? (index === 0 ? 1 : 0) : obj.opened
      })) : [])
    } else {
      router.replace('/')
    }
  }

  return (
    <div className="sm:p-5">
      {isKeyNotAvailable(data) || questions.length < 1 ? (
        <Skeleton />
      ) : (
        <ExamCbt data={data} questions={questions} />
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
