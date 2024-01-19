import { BaseResponse } from '@/@core/domain/entities/response/base.response'
import { PaginateResponse } from '@/@core/domain/entities/response/paginate.response'
import { ExamGateway } from '@/@core/domain/gateways/exam.gateway'
import { AnswerRequest, Exam, ExamDetail, ExamDetailRequest, ExamListRequest, ExamLsData, Questions, QuestionsRequestData, SendTimeLeftRequest, StartExamRequest } from '@/@core/domain/entities/exam'

export class ExamUseCase {
  constructor(private gate: ExamGateway) {}

  async get(request: ExamListRequest): Promise<BaseResponse<PaginateResponse<Exam>>> {
    return this.gate.list(request)
  }

  async view(token: string, params: ExamDetailRequest): Promise<BaseResponse<ExamDetail>> {
    return this.gate.view(token, params)
  }

  async submitAnswer(params: AnswerRequest): Promise<BaseResponse<null>> {
    return this.gate.submitAnswer(params)
  }

  saveExam(data: ExamLsData): void {
    return this.gate.saveExam(data)
  }

  getExam(): ExamLsData | null {
    return this.gate.getExam()
  }

  async viewQuestion(params: QuestionsRequestData): Promise<BaseResponse<Questions[] | null>> {
    return this.gate.viewQuestion(params)
  }

  async startExam(params: StartExamRequest): Promise<BaseResponse<null>> {
    return this.gate.startExam(params)
  }

  async sendTimeLeft(params: SendTimeLeftRequest): Promise<BaseResponse<null>> {
    return this.gate.sendTimeLeft(params)
  }
}
