import { BaseResponse } from '../entities/response/base.response'
import { PaginateResponse } from '../entities/response/paginate.response'
import { Exam, ExamListRequest } from '../entities/exam'

export interface ExamGateway {
  list(request: ExamListRequest): Promise<BaseResponse<PaginateResponse<Exam>>>
}
