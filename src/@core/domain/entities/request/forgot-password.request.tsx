export type ForgotPasswordRequest = {
  url: string
  email: string
}

export type ResetPasswordRequest = {
  email: string
  password: string
  password_confirmation: string
}
