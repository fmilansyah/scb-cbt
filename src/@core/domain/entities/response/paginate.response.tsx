export type PaginateResponseProps<T> = {
  current_page: number
  from: number
  last_page: number
  perpage: number
  total: number
  data: T[]
}

export class PaginateResponse<T> {
  protected _data: T[] = []
  protected _pageSize = 0
  constructor(private props: PaginateResponseProps<T>) {
    this._data = props.data ?? []
    this._pageSize = props.perpage ?? 0
  }
  get current_page(): number {
    return this.props.current_page
  }
  get last_page(): number {
    return this.props.last_page ?? 0
  }
  get perpage(): number {
    return this.props.perpage ?? 0
  }
  get pageSize(): number {
    return this._pageSize
  }
  set pageSize(value: number) {
    this._pageSize = value
  }
  get total(): number {
    return this.props.total ?? 0
  }
  get from(): number {
    return this.props.from ?? 0
  }
  get data(): T[] {
    return this._data
  }
  set data(values: T[]) {
    this._data = values
  }
}
