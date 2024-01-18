export type UserClient = {
  token: string
  detail?: UserClientDetail | null
}

export type UserClientDetail = {
  id?: number
  name?: string
  code?: string
}
