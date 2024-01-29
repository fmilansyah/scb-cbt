import { AnswerRequest, EndExamRequest, ExamDetail, QuestionPackage, Questions } from "@/@core/domain/entities/exam";
import { Button } from "@/components/Elements";
import { Fragment, useEffect, useRef, useState } from "react";
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
// import IconTxtFile from "@/components/Icon/IconTxtFile";
import IconMenu from "@/components/Icon/IconMenu";
import { useRouter } from "next/router";
import IconLoader from "@/components/Icon/IconLoader";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "@/components/Icon/IconX";
import { DurationType, QuestionType } from "@/shared/constants/enums";

interface Props {
  data?: ExamDetail
  questions: Questions[]
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

const ExamCbt = ({ data, questions }: Props) => {
  console.log(questions)
  const router = useRouter()
  const useCase = container.get<ExamUseCase>(Registry.ExamUseCase)
  const timeLeftRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeLeftPackageRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [questionPackageIndex, setQuestionPackageIndex] = useState<number>(0)
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [now, setNow] = useState<number>(Date.now())
  const [nowPackage, setNowPackage] = useState<number>(Date.now())
  const [duration, setDuration] = useState<number>(1000)
  const [durationPackage, setDurationPackage] = useState<number>(1000)
  const [examLs, setExamLs] = useState<Questions[]>(questions)
  const [questionPackages, setQuestionPackages] = useState<QuestionPackage[]>(data?.question_packages ?? [])
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [confirmFinishVisible, setConfirmFinishVisible] = useState(false)
  const [timesUpPackageVisible, setTimesUpPackageVisible] = useState(false)
  const [timerIndex, setTimerIndex] = useState<number>(0) // Untuk mereset timer

  useEffect(() => {
    resetQuestions()
  }, [questions])

  useEffect(() => {
    updateQuestionPackage()
    updateQuestion()
  }, [])

  useEffect(() => {
    updateQuestion()

    function startTimer() {
      timeLeftRef.current = setInterval(sendTimeLeft, 15000);
    };

    startTimer();
    return () => {
      if (timeLeftRef.current) clearInterval(timeLeftRef.current); // cleanup
    }
  }, [examLs[currentQuestion]]);

  useEffect(() => {
    updateQuestionPackage()

    function startTimer() {
      timeLeftPackageRef.current = setInterval(sendTimeLeftPackage, 15000);
    };

    startTimer();
    return () => {
      if (timeLeftPackageRef.current) clearInterval(timeLeftPackageRef.current); // cleanup
    }
  }, [questionPackages[questionPackageIndex]]);

  useEffect(() => {
    updateQuestion()
    updateQuestionPackage()
    setNowPackage(Date.now())
  }, [router?.query])

  const resetQuestions = () => {
    setExamLs(questions)
    setCurrentQuestion(0)
  }

  const updateQuestionPackage = () => {
    let newQuestionPackages = [...questionPackages]
    if (newQuestionPackages.length > 0) {
      const examDetailId = router?.query?.exam_detail_id as unknown as string
      const newQuestionPackageIndex = (questionPackages ?? []).findIndex((obj) => obj.id === parseInt(examDetailId))
      setQuestionPackageIndex(newQuestionPackageIndex)
      setDurationPackage(newQuestionPackages[newQuestionPackageIndex]?.time_left ?? 0)

      // Update opened status
      newQuestionPackages[newQuestionPackageIndex].opened = 1
      setQuestionPackages(newQuestionPackages)
    }
  }

  const sendTimeLeft = async (timeLeft: number | null = null) => {
    const params = {
      exam_session_id: data?.exam_session_id,
      exam_session_detail_id: data?.exam_session_detail_id,
      question_package_id: questionPackages[questionPackageIndex]?.question_package_id,
      question_id: examLs[currentQuestion]?.id,
      course_id: questionPackages[questionPackageIndex]?.course_id,
      time_left: timeLeft !== null ? (timeLeft ?? 0) : examLs[currentQuestion].time_left ? examLs[currentQuestion].time_left : 0, // miliseconds
      opened: examLs[currentQuestion].opened ?? 0,
      exp: 4 * 60, // minute
    }
    await useCase.sendTimeLeft(params)
  }

  const sendTimeLeftPackage = async (timeLeft: number | null = null) => {
    const params = {
      exam_session_id: data?.exam_session_id,
      exam_session_detail_id: data?.exam_session_detail_id,
      question_package_id: questionPackages[questionPackageIndex]?.question_package_id,
      course_id: questionPackages[questionPackageIndex]?.course_id,
      time_left: timeLeft !== null ? (timeLeft ?? 0) : questionPackages[questionPackageIndex].time_left ? questionPackages[questionPackageIndex].time_left : 0, // miliseconds
      opened: questionPackages[questionPackageIndex].opened ?? 0,
      exp: 4 * 60, // minute
    }
    await useCase.sendTimeLeftPackage(params)
  }

  const handleNext = async (outOfTime: boolean = false, destIndex: number | null = null, outOfTimeType: string | null = null) => {
    // Hit time left question hanya jika soal tersebut memiliki durasi
    if (examLs[currentQuestion]?.duration > 0) {
      await sendTimeLeft(outOfTime ? 0 : null)
    }

    // Validasi jika belum memilih jawaban dan masih ada waktu
    if (
      ((isKeyNotAvailable(examLs[currentQuestion]?.user_answers) ||
      (examLs[currentQuestion]?.user_answers ?? []).length < 1)) &&
      !outOfTime
    ) {
      toast.fire({
        title: 'Jawaban harap dipilih',
      });
      return
    }

    if (outOfTime && isKeyNotAvailable(destIndex)) {
      if ((questionPackages[questionPackageIndex]?.time_left ?? 0) <= 0 || outOfTimeType === 'package') {
        handleTickingTimePackage(0)
      }
      if ((examLs[currentQuestion]?.time_left ?? 0) <= 0 || outOfTimeType === 'question') {
        handleTickingTime(0)
      }
    }

    if (
      Array.isArray(examLs[currentQuestion]?.user_answers) &&
      (examLs[currentQuestion]?.user_answers ?? []).length > 0
    ) {
      const params: AnswerRequest = {
        exam_id: data?.id,
        exam_session_id: data?.exam_session_id,
        exam_session_detail_id: data?.exam_session_detail_id,
        question_package_id: examLs[currentQuestion]?.question_package_id,
        question_id: examLs[currentQuestion]?.id,
        question_answer_id: (examLs[currentQuestion]?.user_answers ?? [])[0],
        course_id: examLs[currentQuestion]?.course_id,
      }
      setSubmitLoading(true)
      const exec = await useCase.submitAnswer(params)
      setSubmitLoading(false)

      if (exec.status !== NetworkStatus.SUCCESS) {
        return
      }
    }
    if (currentQuestion < (examLs ?? []).length - 1 || isKeyAvailable(destIndex)) {
      if (isKeyAvailable(destIndex)) {
        if (destIndex !== currentQuestion) {
          setNow(Date.now())
        }
        setCurrentQuestion(destIndex ?? 0)
      } else {
        setNow(Date.now())
        setCurrentQuestion(currentQuestion + 1)
      }
    } else {
      setConfirmFinishVisible(true)
    }
  }

  // Atur ulang durasi dan status terbuka
  const updateQuestion = () => {
    let newExamLs = [...examLs]
    if (newExamLs.length > 0) {
      setDuration(newExamLs[currentQuestion]?.time_left ?? 0)

      // Update opened status
      newExamLs[currentQuestion].opened = 1
      setExamLs(newExamLs)

      setTimerIndex(timerIndex + 1)
    }
  }

  // Simpan jawaban
  const updateAnswer = (answers: number[]) => {
    let newExamLs = [...examLs]
    if (newExamLs.length > 0) {
      newExamLs[currentQuestion].user_answers = answers
      setExamLs(newExamLs)
    }
  }

  const handleTickingTime = (timeLeft: number | null = null) => {
    let newExamLs = [...examLs]
    if (newExamLs.length > 0) {
      newExamLs[currentQuestion].time_left = isKeyAvailable(timeLeft) ? (timeLeft ?? 0) : Math.abs((examLs[currentQuestion]?.time_left ?? 0) - 1000)
      setExamLs(newExamLs)
    }
  }

  const handleTickingTimePackage = (timeLeft: number | null = null) => {
    let newQuestionPackages = [...questionPackages]
    if (newQuestionPackages.length > 0) {
      newQuestionPackages[questionPackageIndex].time_left = isKeyAvailable(timeLeft) ? (timeLeft ?? 0) : Math.abs((newQuestionPackages[questionPackageIndex].time_left ?? 0) - 1000)
      setQuestionPackages(newQuestionPackages)
    }
  }

  const handleChangeQuestion = (question: Questions, destIndex: number) => {
    // Jika cara menjawab adalah berurutan maka cek terlebih jika akan berpindah soal
    if (data?.question_type === QuestionType.Enum.SEQUENCE) {
      if (question && question?.opened) {
        handleNext(true, destIndex)
      }
    } else {
      handleNext(true, destIndex)
    }
  }

  const handleConfirmFinish = async (isContinue = false) => {
    if (isContinue) {
      // Cek apakah ini adalah question package terakhir atau bukan
      if (questionPackageIndex >= 0 && isKeyAvailable(questionPackages[questionPackageIndex + 1]?.id)) {
        router.replace(`/exam/${router?.query?.id}/cbt?token=${router?.query?.token}&exam_detail_id=${questionPackages[questionPackageIndex + 1]?.id ?? ''}&exam_session_detail_id=${data?.exam_session_detail_id}`)
      } else {
        const params: EndExamRequest = {
          exam_id: data?.id,
          exam_session_id: data?.exam_session_id,
          exam_session_detail_id: data?.exam_session_detail_id,
        }
        const exec = await useCase.endExam(params)
        if (exec.status === NetworkStatus.SUCCESS) {
          router.replace('/exam/finish')
        }
      }
    }
    setConfirmFinishVisible(false)
    setTimesUpPackageVisible(false)
  }

  const handleUpdateAnswer = (value: string = '') => {
    if ((questionPackages[questionPackageIndex]?.time_left ?? 0) > 0) {
      if ((examLs[currentQuestion]?.duration ?? 0) > 0) {
        if (
          (examLs[currentQuestion]?.time_left ?? 0) > 0 &&
          (questionPackages[questionPackageIndex]?.time_left ?? 0) > 0
        ) {
          updateAnswer(value ? [parseInt(value)] : [])
        } else {
          toast.fire({
            title: 'Waktu sudah habis! Jawaban tidak bisa diubah',
          });
        }
      } else {
        if (
          (questionPackages[questionPackageIndex]?.time_left ?? 0) > 0
        ) {
          updateAnswer(value ? [parseInt(value)] : [])
        } else {
          toast.fire({
            title: 'Waktu sudah habis! Jawaban tidak bisa diubah',
          });
        }
      }
    } else {
      toast.fire({
        title: 'Waktu pengerjaan paket soal sudah habis! Jawaban tidak bisa diubah',
      });
    }
  }

  const renderCountdown = ({ minutes, seconds }: {
    minutes: number,
    seconds: number
  }) => {
    return <span>{zeroPad(minutes)}:{zeroPad(seconds)}</span>
  }

  const renderQuestions = (question: Questions, index: number) => {
    return (
      <button
        key={index}
        type="button"
        className={`btn ${
          isKeyAvailable(examLs[index]?.user_answers) && Array.isArray(examLs[index]?.user_answers) && (examLs[index]?.user_answers ?? []).length > 0 ? 'btn-success' : 'btn-dark'
        }`}
        onClick={(e) => {
          e.preventDefault()
          handleChangeQuestion(examLs[index], index)
        }}
      >
        {submitLoading && index === currentQuestion ? (
          <IconLoader
            className="w-4.5 h-4.5 shrink-0 animate-spin"
          />
        ) : examLs[index]?.opened || data?.question_type === QuestionType.Enum.NOT_SEQUENCE ? index + 1 : (
          <IconLock
            className={`w-4.5 h-4.5 shrink-0`}
          />
        )}
      </button>
    )
    // return (
    //   <button
    //     key={index}
    //     type="button"
    //     className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${
    //       currentQuestion === index ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
    //     }`}
    //     onClick={(e) => {
    //       e.preventDefault()
    //       handleChangeQuestion(examLs[index], index)
    //     }}
    //   >
    //     <div className="flex items-center">
    //       {submitLoading && index === currentQuestion ? (
    //         <IconLoader
    //           className="w-4.5 h-4.5 shrink-0 animate-spin"
    //         />
    //       ) : examLs[index]?.opened || data?.question_type === QuestionType.Enum.NOT_SEQUENCE ? (
    //         <IconTxtFile
    //           className={`w-4.5 h-4.5 ${isKeyAvailable(examLs[index]?.user_answers) && Array.isArray(examLs[index]?.user_answers) && (examLs[index]?.user_answers ?? []).length > 0 ? 'text-success' : 'text-danger'} shrink-0`}
    //         />
    //       ) : (
    //         examLs[index]?.time_left ?? 0) < 1 &&
    //         data?.question_type === QuestionType.Enum.SEQUENCE
    //       ? (
    //         <IconLock
    //           className={`w-4.5 h-4.5 ${isKeyAvailable(examLs[index]?.user_answers) && Array.isArray(examLs[index]?.user_answers) && (examLs[index]?.user_answers ?? []).length > 0 ? 'text-success' : 'text-danger'} shrink-0`}
    //         />
    //       ) : (
    //         <IconLock
    //           className={`w-4.5 h-4.5 ${isKeyAvailable(examLs[index]?.user_answers) && Array.isArray(examLs[index]?.user_answers) && (examLs[index]?.user_answers ?? []).length > 0 ? 'text-success' : 'text-danger'} shrink-0`}
    //         />
    //       )}
    //       <div className="ltr:ml-3 rtl:mr-3">{index + 1}</div>
    //     </div>
    //   </button>
    // )
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
                    <p>
                      Anda tidak dapat kembali ke paket soal ini.
                      &nbsp;
                      Jika ini adalah paket soal teakhir, anda tidak dapat membuka kembali ujian ini
                      <br />
                      Harap simpan semua jawaban dengan menekan tombol
                      <strong> Berikutnya</strong> atau <strong>Simpan</strong>
                      &nbsp;
                      pada pojok kanan bawah sebelum anda menentukan selesai.
                    </p>
                    <div className="flex justify-end items-center mt-8">
                      <Button outline={true} type="danger" onClick={() => handleConfirmFinish(false)}>
                        Batal
                      </Button>
                      <Button onClick={() => handleConfirmFinish(true)} className="ltr:ml-4 rtl:mr-4">
                        Saya mengerti
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

  const timesUpPackage = () => {
    return (
      <Transition appear show={timesUpPackageVisible} as={Fragment}>
        <Dialog as="div" open={timesUpPackageVisible} onClose={() => console.log('Times Up')}>
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
                    <h5 className="font-bold text-lg">Waktu Habis</h5>
                  </div>
                  <div className="p-5">
                    <p>
                      Durasi pengerjaan paket soal sudah habis, anda tidak dapat kembali dan mengubah jawaban pada paket soal ini
                    </p>
                    <div className="flex justify-end items-center mt-8">
                      <Button onClick={() => handleConfirmFinish(true)} className="ltr:ml-4 rtl:mr-4">
                        Baik
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
      <div className="mb-3">
        <ol className="flex text-primary font-semibold dark:text-white-dark">
          <li className="bg-[#ebedf2] ltr:rounded-l-md rtl:rounded-r-md dark:bg-[#1b2e4b]">
            <button className="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">
              Paket Soal :
            </button>
          </li>
          {questionPackages.map((obj, index) => (
            <li key={index} className="bg-[#ebedf2] dark:bg-[#1b2e4b]">
              <button
                className={
                  obj.id === parseInt(router?.query?.exam_detail_id as string) ? (
                    'bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]'
                  ) : (
                    'p-1.5 px-3 ltr:pl-6 rtl:pr-6 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70'
                  )
                }
              >
                {obj?.course_name}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="relative flex h-full gap-5 sm:h-[calc(100vh_-_5.5rem)] min-[320px]:h-[calc(100vh_-_0rem)]">
        <div
          className={`panel absolute z-10 hidden h-full w-[340px] max-w-full flex-none space-y-4 p-4 ltr:rounded-r-none rtl:rounded-l-none xl:relative xl:block xl:h-auto ltr:xl:rounded-r-md rtl:xl:rounded-l-md ${
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
              <div className="grid grid-cols-5 items-center w-full gap-4">
                {(examLs ?? []).map((obj, index) => renderQuestions(obj, index))}
              </div>
            </PerfectScrollbar>
            <div className="absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0">
              <div className="grid grid-rows-1 items-center w-full gap-2 mb-2">
                <div className="flex flex-row">
                  <button className="btn btn-success"></button>
                  &nbsp;
                  <span>= Sudah Di Jawab</span>
                </div>
                <div className="flex flex-row">
                  <button className="btn btn-dark"></button>
                  &nbsp;
                  <span>= Belum Di Jawab</span>
                </div>
              </div>
              <Button onClick={() => setConfirmFinishVisible(true)} block={true}><IconChecks /> Paket Soal Selesai</Button>
            </div>
          </div>
        </div>
        <div className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowMenu && '!block xl:!hidden'}`} onClick={() => setIsShowMenu(!isShowMenu)}></div>
        <div
          className="panel h-full w-full flex-1 space-y-4 p-4 ltr:rounded-r-none rtl:rounded-l-none xl:relative xl:block xl:h-auto ltr:xl:rounded-r-md rtl:xl:rounded-l-md"
        >
          <div className="flex h-full flex-col pb-16">
            <div className="flex w-full flex-col gap-4 pb-5 sm:flex-row sm:items-center md:justify-between">
              <div className="flex items-center ltr:mr-3 rtl:ml-3">
                <button type="button" className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden" onClick={() => setIsShowMenu(!isShowMenu)}>
                  <IconMenu />
                </button>
                <div className="group relative flex-1">
                  <p className="text-xs">Soal No. {currentQuestion + 1}</p>
                  <h3 className="text-lg font-semibold text-primary">
                    {questionPackages[questionPackageIndex]?.course_name}
                  </h3>
                </div>
              </div>
              <div>
                <div className="flex flex-1 items-center justify-center sm:flex-auto sm:justify-end">
                  Durasi Pengerjaan Paket Soal :
                  <p className="ml-1">
                    <Countdown
                      daysInHours={true}
                      key={questionPackageIndex}
                      date={nowPackage + durationPackage}
                      onComplete={() => {
                        if ((questionPackages[questionPackageIndex]?.time_left ?? 0) > 0) {
                          setTimesUpPackageVisible(true)
                        }
                      }}
                      onTick={() => handleTickingTimePackage()}
                      renderer={renderCountdown}
                    />
                  </p>
                </div>
                {examLs[currentQuestion]?.duration > 0 && (
                  <div className="flex flex-1 items-center justify-center sm:flex-auto sm:justify-end">
                    Durasi Pengerjaan Soal :
                    <p className="ml-1">
                      <Countdown
                        daysInHours={true}
                        key={timerIndex}
                        date={now + duration}
                        onComplete={() => {
                          if ((examLs[currentQuestion]?.time_left ?? 0) > 0) {
                            handleNext(true, null, DurationType.Enum.QUESTION)
                          }
                        }}
                        onTick={() => handleTickingTime()}
                        renderer={renderCountdown}
                      />
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-5 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

            <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
              <div className="text-lg pb-5" dangerouslySetInnerHTML={{ __html: (examLs[currentQuestion]?.question ?? '') }}></div>

              <form className="space-y-5 px-5">
                {examLs[currentQuestion]?.question_answers?.map((obj, index) => (
                  <div key={index}>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="answer"
                        value={obj.id}
                        checked={(examLs[currentQuestion]?.user_answers ?? []).includes(obj.id)}
                        className="form-radio"
                        onChange={({ target: { value } }) => handleUpdateAnswer(value)}
                      />
                      <span dangerouslySetInnerHTML={{ __html: obj?.answer ?? '' }}></span>
                    </label>
                  </div>
                ))}
              </form>
            </PerfectScrollbar>

            <div className="absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0">
              <div className="grid grid-cols-2 items-center w-full">
                <div className="flex items-center">
                  <Button
                    onClick={() => {
                      handleNext(true, currentQuestion - 1)
                    }}
                    disabled={currentQuestion < 1}
                    outline={true}
                  >
                    Sebelumnya
                  </Button>
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    // disabled={(examLs?.questions[currentQuestion]?.time_left ?? 0) <= 0}
                    loading={submitLoading}
                    onClick={() => {
                      if (examLs[currentQuestion]?.duration > 0) {
                        handleNext(
                          (questionPackages[questionPackageIndex]?.time_left ?? 0) <= 0 ||
                          (examLs[currentQuestion]?.time_left ?? 0) <= 0
                        )
                      } else {
                        handleNext(
                          (questionPackages[questionPackageIndex]?.time_left ?? 0) <= 0
                        )
                      }
                    }}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {confirmFinish()}
      {timesUpPackage()}
    </>
  );
};

export default ExamCbt;
