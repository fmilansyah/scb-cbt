import Link from "next/link"

const ExamFinish = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="px-6 py-16 text-center font-semibold before:container before:absolute before:left-1/2 before:aspect-square before:-translate-x-1/2 before:rounded-full before:bg-[linear-gradient(180deg,#4361EE_0%,rgba(67,97,238,0)_50.73%)] before:opacity-10 md:py-20">
        <div className="relative">
            <img
              src="/assets/images/error/maintenence-light.svg"
              alt="maintenence"
              className="mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-20 md:max-w-lg"
            />
            <div className="-mt-8 font-semibold dark:text-white">
              <h2 className="mb-5 text-3xl font-bold text-primary md:text-5xl">Ujian Selesai</h2>
              <h4 className="mb-7 text-xl sm:text-2xl">Terima kasih, panitia akan meninjau hasil ujian anda terlebih dahulu.</h4>
            </div>
            <Link href="/auth/logout" className="btn btn-gradient mx-auto !mt-7 w-max border-0 uppercase shadow-none">
              Keluar
            </Link>
        </div>
      </div>
    </div>
  )
}

export default ExamFinish
