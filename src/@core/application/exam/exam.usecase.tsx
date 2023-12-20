import { BaseResponse } from '@/@core/domain/entities/response/base.response'
import { PaginateResponse } from '@/@core/domain/entities/response/paginate.response'
import { ExamGateway } from '@/@core/domain/gateways/exam.gateway'
import { Exam, ExamListRequest } from '@/@core/domain/entities/exam'

export class ExamUseCase {
  constructor(private gate: ExamGateway) {}

  async get(request: ExamListRequest): Promise<BaseResponse<PaginateResponse<Exam>>> {
    return this.gate.list(request)
  }
}
