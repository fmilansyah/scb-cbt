import { Course } from "./course"

export type ExamDetailRequest = {
  exam_session_id?: number
}

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

export type Answers = {
  id: number
  question_id: number
  answer: string
}

export type Questions = {
  id: number
  question_package_id: number
  question: string
  photo_link: string
  duration: number
  score: number
  course_id: number
  course?: Course
  question_answers?: Answers[]
  user_answers?: number[] | null
  time_left: number | null
  opened: boolean | null
}

export type QuestionPackage = {
  id: number
  exam_id: number
  question_package_id: number
  question_package_code: string
  question_package_name: string
  course_id: number
  course_code: string
  course_name: string
  duration: number
  order: number
}

export type ExamDetail = {
  id: number
  title_exam_session: string
  start_time: string
  end_time: string
  date: string
  exam_session_id: number
  exam_session_detail_id: number
  organization_id: number
  name: string
  duration: number
  description?: string
  actived: number
  created_at?: string
  created_by?: number
  updated_at?: string
  updated_by?: number
  question_type: number
  questions: Questions[]
  question_packages: QuestionPackage[]
}

export type AnswerRequest = {
  exam_id?: number
  exam_session_id?: number
  exam_session_detail_id?: number
  question_package_id?: number
  question_id?: number
  question_answer_id?: number | null
  course_id?: number
}

export type ExamLsData = {
  token: string
  exam_end_at: string
  questions: AnswerLsData[]
}

export type AnswerLsData = {
  time_left?: number
  opened?: boolean
  user_answers?: number[] | null
  question_id?: number
}

export type QuestionsRequestData = {
  exam_detail_id?: number
  exam_session_detail_id?: number
}

export type StartExamRequest = {
  exam_id?: number
  exam_session_id?: number
  exam_session_detail_id?: number
}

export type SendTimeLeftRequest = {
  exam_session_id: number
  exam_session_detail_id: number
  question_package_id: number
  question_id: number
  course_id: number
  time_left: number
  opened: number
  exp: number
}
