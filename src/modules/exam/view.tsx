import { ExamDetail } from "@/@core/domain/entities/exam";
import IconClipboardText from "@/components/Icon/IconClipboardText";
import { Button } from "@/components/Elements";
import dayjs from "dayjs";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from "react";
import IconX from "@/components/Icon/IconX";
import { useRouter } from "next/router";

interface Props {
  data?: ExamDetail
}

const ViewExam = ({ data }: Props) => {
  const router = useRouter()

  const [confirmStartVisible, setConfirmStartVisible] = useState<boolean>(false)
  const [iUnderstand, setIUnderstand] = useState<boolean>(false)

  const handleStart = () => {
    setConfirmStartVisible(true)
  }

  const handleConfirmAction = (isContinue = false) => {
    if (isContinue) {
      router.replace(`/exam/${router?.query?.id}/cbt?token=${router?.query?.token}`)
    }
    setConfirmStartVisible(false)
  }

  const confirmStart = () => {
    return (
      <Transition appear show={confirmStartVisible} as={Fragment}>
        <Dialog as="div" open={confirmStartVisible} onClose={() => handleConfirmAction(false)}>
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
                    <h5 className="font-bold text-lg">PERHATIAN!</h5>
                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => handleConfirmAction(false)}>
                      <IconX />
                    </button>
                  </div>
                  <div className="p-5">
                    <p>Peraturan CBT</p>
                    <label className="inline-flex mt-2">
                      <input type="checkbox" className="form-checkbox rounded-full" checked={iUnderstand} onChange={({ target: { checked } }) => setIUnderstand(checked)} />
                      <span className="text-sm">Saya telah membaca dan akan mematuhi dengan peraturan di atas</span>
                    </label>
                    <div className="flex justify-end items-center mt-8">
                      <Button outline={true} type="danger" onClick={() => handleConfirmAction(false)}>
                        Batal
                      </Button>
                      <Button onClick={() => handleConfirmAction(true)} disabled={!iUnderstand} className="ltr:ml-4 rtl:mr-4">
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

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 pb-5">
        <div className="col-span-2">
          <span className="badge badge-outline-primary">Informasi Ujian</span>
          <div className="flex items-center text-center text-[#0b549e] mt-3">
            <div className="shrink-0">
              <IconClipboardText />
            </div>
            <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">{data?.title_exam_session}</h3>
          </div>
        </div>
        <div className="text-right">
          <div className="text-warning">Waktu Pengerjaan</div>
          <div className="mt-2 text-lg font-semibold">{data?.duration} Menit</div>
        </div>
      </div>
      <div className="mb-5 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
      <div>
        <strong>Waktu Ujian</strong>
        <div className="ml-3 mb-3">
          Tanggal : {data?.date ? dayjs(data?.date, 'YYYY-MM-DDTHH:mm:ss[Z]').format('DD MMM YYYY') : '-' }
          <br />
          Jam : {data?.start_time && data?.end_time ? data?.start_time + ' - ' + data?.end_time : '-' }
        </div>
        <div className="pb-5" dangerouslySetInnerHTML={{ __html: data?.description ?? '' }} />
      </div>
      <div className="mb-5 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
      <Button rounded={true} onClick={() => handleStart()}>Mulai Ujian</Button>
      {confirmStart()}
    </div>
  );
};

export default ViewExam;
