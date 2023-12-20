import IconBellBing from '@/components/Icon/IconBellBing'
import ExamList from '@/modules/exam/list'

export default function Home() {
  return (
    <>
      <div>
        <div className="overflow-x-auto">
          <h1 className="ltr:mr-3 rtl:ml-3 text-2xl font-bold">Selamat Datang</h1>
          <div className="font-semibold text-white-dark mb-5">
            <p>Ujian Online Berbasis Komputer</p>
          </div>

          <div className="relative flex items-center rounded border !border-primary bg-primary-light p-3.5 text-primary before:absolute before:top-1/2 before:-mt-2 before:border-l-8 before:border-t-8 before:border-b-8 before:border-t-transparent before:border-b-transparent before:border-l-inherit ltr:border-l-[64px] ltr:before:left-0 rtl:border-r-[64px] rtl:before:right-0 rtl:before:rotate-180 dark:bg-primary-dark-light">
            <span className="absolute inset-y-0 m-auto h-6 w-6 text-white ltr:-left-11 rtl:-right-11">
              <IconBellBing className="w-6 h-6" />
            </span>
            <span className="ltr:pr-2 rtl:pl-2">
              <strong className="ltr:mr-1 rtl:ml-1">Informasi Penting!</strong>
              <br />
              Silakan pilih tes yang diikuti dari daftar tes yang tersedia dibawah ini. Jika tes tidak muncul harap menghubungi operator yang bertugas.
            </span>
          </div>
        </div>
        <div className="panel mt-3">
          <ExamList />
        </div>
      </div>
    </>
  )
}
