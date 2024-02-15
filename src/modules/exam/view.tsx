import { ExamDetail } from "@/@core/domain/entities/exam";
import IconClipboardText from "@/components/Icon/IconClipboardText";
import { Button } from "@/components/Elements";
import dayjs from "dayjs";
import { useState } from "react";
import { useRouter } from "next/router";
import IconClock from "@/components/Icon/IconClock";
import AnimateHeight from 'react-animate-height';
import IconCaretDown from "@/components/Icon/IconCaretDown";
import Countdown from "react-countdown";
import IconNotes from "@/components/Icon/IconNotes";
import IconNotesEdit from "@/components/Icon/IconNotesEdit";
import IconListCheck from "@/components/Icon/IconListCheck";
import { secondToMinute } from "@/shared/utils/datetime";
import { Registry, container } from "@/@core/infrastructure/container-registry";
import { ExamUseCase } from "@/@core/application/exam/exam.usecase";
import { NetworkStatus } from "@/shared/constants/network";

interface Props {
  data?: ExamDetail
}

const ViewExam = ({ data }: Props) => {
  const router = useRouter()

  const [iUnderstand, setIUnderstand] = useState<boolean>(false)
  const [infoActive, setInfoActive] = useState<string[]>(['1', '2', '3', '4'])
  const [startTime] = useState<string>(dayjs(data?.date, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY-MM-DD') + ' ' + (data?.start_time ?? ''))
  const [endTime] = useState<string>(dayjs(data?.date, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY-MM-DD') + ' ' + (data?.end_time ?? ''))
  const [loading, setLoading] = useState<boolean>(false)

  const useCase = container.get<ExamUseCase>(Registry.ExamUseCase)

  const toggleInfo = (value: string) => {
    let newInfoActive = [...infoActive];
    if (infoActive.includes(value)) {
      newInfoActive = newInfoActive.filter((obj) => obj !== value)
    } else {
      newInfoActive.push(value)
    }
    setInfoActive(newInfoActive)
  }

  const handleConfirmAction = async () => {
    setLoading(true)
    const params = {
      exam_id: data?.id,
      exam_session_id: data?.exam_session_id,
      exam_session_detail_id: data?.exam_session_detail_id,
    }
    const exec = await useCase.startExam(params)
    if (exec?.status === NetworkStatus.SUCCESS) {
      // const windowFeatures = `left=0,top=0,width=${screen.width},height=${screen.height}`;
      // window.open(
      //   `/exam/${router?.query?.id}/cbt?token=${router?.query?.token}&exam_session_detail_id=${data?.exam_session_detail_id}&exam_detail_id=${data?.question_packages[0]?.id ?? ''}`,
      //   '_blank',
      //   windowFeatures,
      // );
      // if (!handle) {
        
      // }
      enterFullScreen()
      router.replace(`/exam/${router?.query?.id}/cbt?token=${router?.query?.token}&exam_session_detail_id=${data?.exam_session_detail_id}&exam_detail_id=${data?.question_packages[0]?.id ?? ''}`)
    } else {
      setLoading(false)
    }
  }

  const enterFullScreen = () => {
    // Trigger fullscreen
  const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
    mozRequestFullScreen(): Promise<void>;
    webkitRequestFullscreen(): Promise<void>;
    msRequestFullscreen(): Promise<void>;
  };

  if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
    docElmWithBrowsersFullScreenFunctions.requestFullscreen();
  } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
    docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
  } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
  } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
    docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
  }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-5">
        <div className="col-span-2">
          <div className="flex items-center justify-between">
            <div className="badge badge-outline-primary">Informasi Ujian</div>
            <div className="flex items-center md:hidden">
              <IconClock className="text-[#0b549e]" />
              &nbsp;
              <p>
                {secondToMinute(data?.duration)}
              </p>
            </div>
          </div>
          <div className="flex items-center text-center text-[#0b549e] mt-3">
            <div className="shrink-0">
              <IconClipboardText />
            </div>
            <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">{data?.title_exam_session}</h3>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-primary">Waktu Pengerjaan</div>
          <div className="mt-2 text-lg font-semibold">{secondToMinute(data?.duration)}</div>
        </div>
      </div>
      <div className="space-y-2 font-semibold">
        <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
          <button
            type="button"
            className="p-4 w-full flex items-center text-primary dark:bg-[#1b2e4b]"
            onClick={() => toggleInfo('1')}
          >
            <IconNotesEdit className="ltr:mr-2 rtl:ml-2 text-primary shrink-0" />
            Peraturan Ujian
            <div className={`ltr:ml-auto rtl:mr-auto ${infoActive.includes('1') ? 'rotate-180' : ''}`}>
              <IconCaretDown />
            </div>
          </button>
          <div>
            <AnimateHeight duration={300} height={infoActive.includes('1') ? 'auto' : 0}>
              <div className="space-y-2 p-4 border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                Peraturan
              </div>
            </AnimateHeight>
          </div>
        </div>
        <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
          <button
            type="button"
            className="p-4 w-full flex items-center text-primary dark:bg-[#1b2e4b]"
            onClick={() => toggleInfo('2')}
          >
            <IconClock className="ltr:mr-2 rtl:ml-2 text-primary shrink-0" />
            Waktu Ujian
            <div className={`ltr:ml-auto rtl:mr-auto ${infoActive.includes('2') ? 'rotate-180' : ''}`}>
              <IconCaretDown />
            </div>
          </button>
          <div>
            <AnimateHeight duration={300} height={infoActive.includes('2') ? 'auto' : 0}>
              <div className="space-y-2 p-4 border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                <div>
                  Tanggal : {data?.date ? dayjs(data?.date, 'YYYY-MM-DDTHH:mm:ss[Z]').format('DD MMM YYYY') : '-' }
                </div>
                <div>
                  Jam : {data?.start_time && data?.end_time ? data?.start_time + ' - ' + data?.end_time : '-' }
                </div>
                <div>
                  Ujian Dimulai Dalam :
                  &nbsp;
                  <Countdown
                    daysInHours={true}
                    date={Date.now() + dayjs(startTime).diff(dayjs())}
                  >
                    <span>Sudah Dimulai</span>
                  </Countdown>
                </div>
                <div>
                  Ujian Berakhir Dalam :
                  &nbsp;
                  <Countdown
                    daysInHours={true}
                    date={Date.now() + dayjs(endTime).diff(dayjs())}
                  >
                    <span>Sudah Berakhir</span>
                  </Countdown>
                </div>
              </div>
            </AnimateHeight>
          </div>
        </div>
        <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
          <button
            type="button"
            className="p-4 w-full flex items-center text-primary dark:bg-[#1b2e4b]"
            onClick={() => toggleInfo('3')}
          >
            <IconListCheck className="ltr:mr-2 rtl:ml-2 text-primary shrink-0" />
            Paket Soal
            <div className={`ltr:ml-auto rtl:mr-auto ${infoActive.includes('3') ? 'rotate-180' : ''}`}>
              <IconCaretDown />
            </div>
          </button>
          <div>
            <AnimateHeight duration={300} height={infoActive.includes('3') ? 'auto' : 0}>
              <div className="space-y-2 p-4 border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                <div className="table-responsive mb-5">
                  <table className="table-striped">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>No.</th>
                        <th>Paket Soal</th>
                        <th>Mata Pelajaran</th>
                        <th>Durasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.question_packages ?? []).map((obj, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{obj?.question_package_name}</td>
                            <td>{obj?.course_name}</td>
                            <td>{secondToMinute(obj?.duration)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimateHeight>
          </div>
        </div>
        <div className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
          <button
            type="button"
            className="p-4 w-full flex items-center text-primary dark:bg-[#1b2e4b]"
            onClick={() => toggleInfo('4')}
          >
            <IconNotes className="ltr:mr-2 rtl:ml-2 text-primary shrink-0" />
            Keterangan
            <div className={`ltr:ml-auto rtl:mr-auto ${infoActive.includes('4') ? 'rotate-180' : ''}`}>
              <IconCaretDown />
            </div>
          </button>
          <div>
            <AnimateHeight duration={300} height={infoActive.includes('4') ? 'auto' : 0}>
              <div className="space-y-2 p-4 border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                <div dangerouslySetInnerHTML={{ __html: data?.description ?? 'Tidak ada keterangan' }} />
              </div>
            </AnimateHeight>
          </div>
        </div>
      </div>
      <label className="inline-flex mt-5">
        <input type="checkbox" className="form-checkbox rounded-full" checked={iUnderstand} onChange={({ target: { checked } }) => setIUnderstand(checked)} />
        <span className="text-sm">Saya telah membaca dan akan mematuhi dengan peraturan di atas</span>
      </label>
      <Button loading={loading} rounded={true} onClick={() => handleConfirmAction()} disabled={!iUnderstand} className="mt-2">Mulai Ujian</Button>
    </div>
  );
};

export default ViewExam;
