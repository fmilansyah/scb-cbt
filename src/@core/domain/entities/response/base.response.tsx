export type BaseResponseProps<T> = {
  status: number
  message: string
  data?: T
}

export class BaseResponse<T = null> {
  constructor(private props: BaseResponseProps<T>) {}
  get status(): number {
    return this.props.status
  }
  get message(): string {
    return this.props.message
  }
  get data(): T | null {
    return this.props.data ?? null
  }
}
