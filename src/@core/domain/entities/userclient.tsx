export type UserClient = {
  token: string
  detail?: UserClientDetail | null
}

export type UserClientDetail = {
  name?: string
  code?: string
}
