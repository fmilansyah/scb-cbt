import { AnswerLsData, AnswerRequest, ExamDetail, ExamLsData, Questions } from "@/@core/domain/entities/exam";
import { Button } from "@/components/Elements";
import { Fragment, useEffect, useState } from "react";
import IconClock from "@/components/Icon/IconClock";
import Countdown, { zeroPad } from 'react-countdown';
import { Registry, container } from "@/@core/infrastructure/container-registry";
import { ExamUseCase } from "@/@core/application/exam/exam.usecase";
import { NetworkStatus } from "@/shared/constants/network";
import Swal from 'sweetalert2';
import { isKeyAvailable, isKeyNotAvailable } from "@/shared/utils/formatter";
import IconLock from "@/components/Icon/IconLock";
import IconClipboardText from "@/components/Icon/IconClipboardText";
import PerfectScrollbar from 'react-perfect-scrollbar';
import IconChecks from "@/components/Icon/IconChecks";
import { millisecondToMinute } from "@/shared/utils/datetime";
import IconTxtFile from "@/components/Icon/IconTxtFile";
import IconMenu from "@/components/Icon/IconMenu";
import { useRouter } from "next/router";
import IconLoader from "@/components/Icon/IconLoader";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "@/components/Icon/IconX";

interface Props {
  data?: ExamDetail
  examLsData?: ExamLsData | null
}

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  showCloseButton: true,
  customClass: {
    popup: `color-warning`,
  },
});

const ExamCbt = ({ data, examLsData }: Props) => {
  const router = useRouter()
  const useCase = container.get<ExamUseCase>(Registry.ExamUseCase)

  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [now, setNow] = useState<number>(Date.now())
  const [duration, setDuration] = useState<number>(1000)
  const [examLs, setExamLs] = useState<ExamLsData | null | undefined>(examLsData)
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [confirmFinishVisible, setConfirmFinishVisible] = useState(false)
  const [timerIndex, setTimerIndex] = useState<number>(0) // Untuk mereset timer

  useEffect(() => {
    updateQuestion()
  }, [])

  useEffect(() => {
    updateQuestion()
  }, [currentQuestion])

  // Update exam di cookies untuk digunakan kembali jika page dimuat ulang
  useEffect(() => {
    updateExamLs()
  }, [examLs])

  const handleNext = async (outOfTime: boolean = false, destIndex: number | null = null) => {
    // Validasi jika belum memilih jawaban dan masih ada waktu
    if (
      ((isKeyNotAvailable(examLs?.questions[currentQuestion]?.user_answers) ||
      (examLs?.questions[currentQuestion]?.user_answers ?? []).length < 1)) &&
      !outOfTime
    ) {
      toast.fire({
        title: 'Jawaban harap dipilih',
      });
      return
    }

    if (outOfTime && isKeyNotAvailable(destIndex)) {
      handleTickingTime(0)
    }

    if (Array.isArray(examLs?.questions[currentQuestion]?.user_answers) && (examLs?.questions[currentQuestion]?.user_answers ?? []).length > 0) {
      const params: AnswerRequest = {
        exam_id: data?.id,
        exam_session_id: data?.exam_session_id,
        exam_session_detail_id: data?.exam_session_detail_id,
        question_package_id: data?.questions[currentQuestion]?.question_package_id,
        question_id: data?.questions[currentQuestion]?.id,
        question_answer_id: (examLs?.questions[currentQuestion]?.user_answers ?? [])[0],
        course_id: data?.questions[currentQuestion]?.course_id,
      }
      setSubmitLoading(true)
      const exec = await useCase.submitAnswer(params)
      setSubmitLoading(false)

      if (exec.status !== NetworkStatus.SUCCESS) {
        return
      }
    }
    if (currentQuestion < (data?.questions ?? []).length - 1 || isKeyAvailable(destIndex)) {
      setNow(Date.now())
      if (isKeyAvailable(destIndex)) {
        setCurrentQuestion(destIndex ?? 0)
      } else {
        setCurrentQuestion(currentQuestion + 1)
      }
    }
  }

  const updateQuestion = () => {
    let examData = null
    if (examLs) {
      examData = {...examLs}
    }
    if (examData && examData?.questions) {
      setDuration(examData?.questions[currentQuestion]?.time_left ?? 0)

      // Update opened status
      examData.questions[currentQuestion].opened = true
      setExamLs(examData)

      setTimerIndex(timerIndex + 1)
    }
  }

  const updateAnswer = (answers: number[]) => {
    let examData = null
    if (examLs) {
      examData = {...examLs}
    }
    if (examData && examData?.questions) {
      examData.questions[currentQuestion].user_answers = answers
      setExamLs(examData)
    }
  }

  const handleTickingTime = (timeLeft: number | null = null) => {
    let examData = null
    if (examLs) {
      examData = {...examLs}
    }
    if (examData && examData?.questions) {
      examData.questions[currentQuestion].time_left = isKeyAvailable(timeLeft) ? (timeLeft ?? 0) : Math.abs((examData?.questions[currentQuestion]?.time_left ?? 0) - 1000)
      setExamLs(examData)
    }
  }

  const updateExamLs = () => {
    if (examLs) {
      useCase.saveExam(examLs)
    }
  }

  const handleChangeQuestion = (question: AnswerLsData | null | undefined, destIndex: number) => {
    if (question && question?.opened) {
      handleNext(true, destIndex)
    }
  }

  const handleConfirmFinish = (isContinue = false) => {
    if (isContinue) {
      router.replace(`/exam/finish`)
    }
    setConfirmFinishVisible(false)
  }

  const handleUpdateAnswer = (value: string = '') => {
    if ((examLs?.questions[currentQuestion]?.time_left ?? 0) > 0) {
      updateAnswer(value ? [parseInt(value)] : [])
    } else {
      toast.fire({
        title: 'Waktu sudah habis! Jawaban tidak bisa diubah',
      });
    }
  }

  const renderCountdown = ({ minutes, seconds }: {
    minutes: number,
    seconds: number
  }) => {
    return <span>{zeroPad(minutes)}:{zeroPad(seconds)}</span>
  }

  const countdown = () => {
    return (
      <Countdown
        daysInHours={true}
        key={timerIndex}
        date={now + duration}
        renderer={renderCountdown}
      />
    )
  }

  const renderQuestions = (question: Questions, index: number) => {
    return (
      <button
        key={index}
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${
          currentQuestion === index ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
        }`}
        onClick={(e) => {
          e.preventDefault()
          handleChangeQuestion(examLs?.questions[index], index)
        }}
      >
        <div className="flex items-center">
          {submitLoading && index === currentQuestion ? (
            <IconLoader className="w-4.5 h-4.5 shrink-0 animate-spin" />
          ) : (examLs?.questions[index]?.time_left ?? 0) < 1 ? (
            <IconLock className={`w-4.5 h-4.5 ${isKeyAvailable(examLs?.questions[index]?.user_answers) && Array.isArray(examLs?.questions[index]?.user_answers) && (examLs?.questions[index]?.user_answers ?? []).length > 0 ? 'text-success' : 'text-danger'} shrink-0`} />
          ) : examLs?.questions[index]?.opened ? (
            <IconTxtFile className={`w-4.5 h-4.5 ${isKeyAvailable(examLs?.questions[index]?.user_answers) && Array.isArray(examLs?.questions[index]?.user_answers) && (examLs?.questions[index]?.user_answers ?? []).length > 0 ? 'text-success' : 'text-danger'} shrink-0`} />
          ) : (
            <IconLock className={`w-4.5 h-4.5 ${isKeyAvailable(examLs?.questions[index]?.user_answers) && Array.isArray(examLs?.questions[index]?.user_answers) && (examLs?.questions[index]?.user_answers ?? []).length > 0 ? 'text-success' : 'text-danger'} shrink-0`} />
          )}
          <div className="ltr:ml-3 rtl:mr-3">Soal No. {index + 1}</div>
        </div>
        <div className="whitespace-nowrap rounded-md bg-primary-light py-0.5 px-2 font-semibold dark:bg-[#060818]">
          {index === currentQuestion ? countdown() : millisecondToMinute(examLs?.questions[index]?.time_left ?? 0)}
        </div>
      </button>
    )
  }

  const confirmFinish = () => {
    return (
      <Transition appear show={confirmFinishVisible} as={Fragment}>
        <Dialog as="div" open={confirmFinishVisible} onClose={() => handleConfirmFinish(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                  <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                    <h5 className="font-bold text-lg">Apakah Anda Yakin?</h5>
                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => handleConfirmFinish(false)}>
                      <IconX />
                    </button>
                  </div>
                  <div className="p-5">
                    <p>Harap simpan semua jawaban dengan menekan tombol <strong>Berikutnya</strong> atau <strong>Simpan</strong> pada pojok kanan bawah sebelum anda menentukan selesai</p>
                    <div className="flex justify-end items-center mt-8">
                      <Button outline={true} type="danger" onClick={() => handleConfirmFinish(false)}>
                        Batal
                      </Button>
                      <Button onClick={() => handleConfirmFinish(true)} className="ltr:ml-4 rtl:mr-4">
                        Ya, sudah disimpan
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
  }

  return (
    <>
      <div className="relative flex h-full gap-5 sm:h-[calc(100vh_-_2.5rem)] min-[320px]:h-[calc(100vh_-_0rem)]">
        <div
          className={`panel absolute z-10 hidden h-full w-[240px] max-w-full flex-none space-y-4 p-4 ltr:rounded-r-none rtl:rounded-l-none xl:relative xl:block xl:h-auto ltr:xl:rounded-r-md rtl:xl:rounded-l-md ${
            isShowMenu && '!block'
          }`}
        >
          <div className="flex h-full flex-col pb-16">
            <div className="pb-5">
              <div className="flex items-center text-center">
                <div className="shrink-0">
                  <IconClipboardText />
                </div>
                <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Daftar Soal</h3>
              </div>
            </div>
            <div className="mb-5 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
            <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
              <div className="space-y-1">
                {(data?.questions ?? []).map((obj, index) => renderQuestions(obj, index))}
              </div>
            </PerfectScrollbar>
            <div className="absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0">
              <Button onClick={() => setConfirmFinishVisible(true)} block={true}><IconChecks /> Selesai</Button>
            </div>
          </div>
        </div>
        <div className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowMenu && '!block xl:!hidden'}`} onClick={() => setIsShowMenu(!isShowMenu)}></div>
        <div
          className="panel h-full w-full flex-1 space-y-4 p-4 ltr:rounded-r-none rtl:rounded-l-none xl:relative xl:block xl:h-auto ltr:xl:rounded-r-md rtl:xl:rounded-l-md"
        >
          <div className="flex h-full flex-col pb-16">
            <div className="flex w-full flex-col gap-4 pb-5 sm:flex-row sm:items-center">
              <div className="flex items-center ltr:mr-3 rtl:ml-3">
                <button type="button" className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden" onClick={() => setIsShowMenu(!isShowMenu)}>
                  <IconMenu />
                </button>
                <div className="group relative flex-1">
                  <h3 className="text-lg font-semibold text-primary">{data?.questions[currentQuestion]?.course?.name}</h3>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center sm:flex-auto sm:justify-end">
                <IconClock />
                <p className="ml-1">
                  <Countdown
                    daysInHours={true}
                    key={timerIndex}
                    date={now + duration}
                    onComplete={() => {
                      if ((examLs?.questions[currentQuestion]?.time_left ?? 0) > 0) {
                        handleNext(true)
                      }
                    }}
                    onTick={() => handleTickingTime()}
                    renderer={renderCountdown}
                  />
                </p>
              </div>
            </div>

            <div className="mb-5 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

            <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
              <div className="text-lg pb-5" dangerouslySetInnerHTML={{ __html: (data?.questions[currentQuestion]?.question ?? '') }}></div>

              <form className="space-y-5 px-5">
                {data?.questions[currentQuestion]?.question_answers?.map((obj, index) => (
                  <div key={index}>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="answer"
                        value={obj.id}
                        checked={(examLs?.questions[currentQuestion]?.user_answers ?? []).includes(obj.id)}
                        className="form-radio"
                        onChange={({ target: { value } }) => handleUpdateAnswer(value)}
                      />
                      <span>{obj?.answer}</span>
                    </label>
                  </div>
                ))}
              </form>
            </PerfectScrollbar>

            <div className="absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0">
              <div className="grid grid-cols-2 items-center w-full">
                <div className="font-bold text-[#0b549e]">Soal No. {currentQuestion + 1}</div>
                <div className="flex items-center justify-end">
                  <Button
                    // disabled={(examLs?.questions[currentQuestion]?.time_left ?? 0) <= 0}
                    loading={submitLoading}
                    onClick={() => handleNext((examLs?.questions[currentQuestion]?.time_left ?? 0) <= 0)}
                  >
                    {currentQuestion >= (data?.questions?.length ?? 0) - 1 ? 'Simpan' : 'Berikutnya'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {confirmFinish()}
    </>
  );
};

export default ExamCbt;
