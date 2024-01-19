import { BaseResponse } from '@/@core/domain/entities/response/base.response'
import { PaginateResponse } from '@/@core/domain/entities/response/paginate.response'
import { NetworkService } from '@/shared/constants/network'
import { AxiosInstance } from 'axios'
import {
  AnswerRequest,
  Exam,
  ExamDetail,
  ExamDetailRequest,
  ExamLsData,
  Questions,
  QuestionsRequestData,
  SendTimeLeftRequest,
  StartExamRequest,
} from '@/@core/domain/entities/exam'
import { ExamListRequest } from '@/@core/domain/entities/exam'
import { ExamGateway } from '@/@core/domain/gateways/exam.gateway'
import { StorageConst } from '@/shared/constants/storage'
import Cookies from 'js-cookie'

export class ExamHttpGateway implements ExamGateway {
  constructor(private http: AxiosInstance) {
    http.defaults.headers.common[NetworkService.KEY] = NetworkService.ASSESSMENT
  }
  async list(
    params: ExamListRequest
  ): Promise<BaseResponse<PaginateResponse<Exam>>> {
    return this.http
      .get<BaseResponse<PaginateResponse<Exam>>>(
        '/cbt/dashboard-exam',
        {
          params,
        }
      )
      .then((resp) => resp.data)
      .catch((err) => err.response.data)
  }
  async view(
    token: string,
    params: ExamDetailRequest
  ): Promise<BaseResponse<ExamDetail>> {
    return this.http
      .get<BaseResponse<ExamDetail>>(
        `/cbt/dashboard-exam/view-exam/${token}`,
        {
          params,
        }
      )
      .then((resp) => resp.data)
      .catch((err) => err.response.data)
  }
  async submitAnswer(
    params: AnswerRequest
  ): Promise<BaseResponse<null>> {
    return this.http
      .put<BaseResponse<null>>(
        `/cbt/dashboard-exam/send-result`, params
      )
      .then((resp) => resp.data)
      .catch((err) => err.response.data)
  }

  saveExam(data: ExamLsData): void {
    Cookies.set(StorageConst.ExamKey, JSON.stringify(data), {
      expires: new Date(data.exam_end_at),
    })
  }

  getExam(): ExamLsData | null {
    const examCookie = Cookies.get(StorageConst.ExamKey)
    if (examCookie) {
      const examData: ExamLsData = JSON.parse(examCookie)
      return examData
    }
    return null
  }

  async viewQuestion(
    params: QuestionsRequestData
  ): Promise<BaseResponse<Questions[] | null>> {
    return this.http
      .get<BaseResponse<Questions[] | null>>(
        '/cbt/dashboard-exam/view-question',
        {
          params,
        }
      )
      .then((resp) => resp.data)
      .catch((err) => err.response.data)
  }

  async startExam(
    params: StartExamRequest
  ): Promise<BaseResponse<null>> {
    return this.http
      .put<BaseResponse<null>>(
        `/cbt/dashboard-exam/start-exam`, params
      )
      .then((resp) => resp.data)
      .catch((err) => err.response.data)
  }

  async sendTimeLeft(
    params: SendTimeLeftRequest
  ): Promise<BaseResponse<null>> {
    return this.http
      .put<BaseResponse<null>>(
        `/cbt/dashboard-exam/send-time-left`, params
      )
      .then((resp) => resp.data)
      .catch((err) => err.response.data)
  }
}
