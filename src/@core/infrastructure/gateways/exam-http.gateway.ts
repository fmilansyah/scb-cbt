import { BaseResponse } from '@/@core/domain/entities/response/base.response'
import { PaginateResponse } from '@/@core/domain/entities/response/paginate.response'
import { NetworkService } from '@/shared/constants/network'
import { AxiosInstance } from 'axios'
import {
  Exam,
} from '@/@core/domain/entities/exam'
import { ExamListRequest } from '@/@core/domain/entities/exam'
import { ExamGateway } from '@/@core/domain/gateways/exam.gateway'

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
}
