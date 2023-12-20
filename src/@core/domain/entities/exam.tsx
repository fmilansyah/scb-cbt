export type ExamListRequest = {
  title?: string
  exam_name?: string
  page?: number
  perpage?: number
}

export type Exam = {
  id: number
  exam_session_id: number
  exam_id: number
  title: string
  exam_name: string
  date: string
  start_time: string
  end_time: string
}
