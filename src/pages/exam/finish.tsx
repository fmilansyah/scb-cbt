import BlankLayout from '@/components/Layouts/BlankLayout'
import ExamFinish from '@/modules/exam/finish'

const Finish = () => {
  return <ExamFinish />
}

Finish.getLayout = (page: any) => {
  return <BlankLayout>{page}</BlankLayout>
}

export const getServerSideProps = () => {
  return {
    props: {
      page_title: 'Ujian Selesai',
    },
  }
}

export default Finish
