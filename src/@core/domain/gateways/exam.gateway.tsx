import { BaseResponse } from '../entities/response/base.response'
import { PaginateResponse } from '../entities/response/paginate.response'
import { AnswerRequest, EndExamRequest, Exam, ExamDetail, ExamDetailRequest, ExamListRequest, Questions, QuestionsRequestData, SendTimeLeftRequest, SendViolationEventRequest, StartExamRequest } from '../entities/exam'

export interface ExamGateway {
  list(request: ExamListRequest): Promise<BaseResponse<PaginateResponse<Exam>>>
  view(token: string, params: ExamDetailRequest): Promise<BaseResponse<ExamDetail>>
  submitAnswer(params: AnswerRequest): Promise<BaseResponse<null>>
  saveExam(data?: ExamDetail): void
  getExam(): ExamDetail | null
  viewQuestion(params: QuestionsRequestData): Promise<BaseResponse<Questions[] | null>>
  startExam(params: StartExamRequest): Promise<BaseResponse<null>>
  endExam(params: EndExamRequest): Promise<BaseResponse<null>>
  sendTimeLeft(params: SendTimeLeftRequest): Promise<BaseResponse<null>>
  sendTimeLeftPackage(params: SendTimeLeftRequest): Promise<BaseResponse<null>>
  sendViolationEvent(params: SendViolationEventRequest): Promise<BaseResponse<null>>
}
