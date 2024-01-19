import { BaseResponse } from '../entities/response/base.response'
import { PaginateResponse } from '../entities/response/paginate.response'
import { AnswerRequest, Exam, ExamDetail, ExamDetailRequest, ExamListRequest, ExamLsData, Questions, QuestionsRequestData, SendTimeLeftRequest, StartExamRequest } from '../entities/exam'

export interface ExamGateway {
  list(request: ExamListRequest): Promise<BaseResponse<PaginateResponse<Exam>>>
  view(token: string, params: ExamDetailRequest): Promise<BaseResponse<ExamDetail>>
  submitAnswer(params: AnswerRequest): Promise<BaseResponse<null>>
  saveExam(data: ExamLsData): void
  getExam(): ExamLsData | null
  viewQuestion(params: QuestionsRequestData): Promise<BaseResponse<Questions[] | null>>
  startExam(params: StartExamRequest): Promise<BaseResponse<null>>
  sendTimeLeft(params: SendTimeLeftRequest): Promise<BaseResponse<null>>
}
