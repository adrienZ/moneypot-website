interface IBase {
  targetEmail: string
}

interface ISendVerificationVerificationParams extends IBase {
  code: string
}

interface ISendResetPasswordRequestParams extends IBase {
  url: string
}

export interface IEmailService {
  welcomeEmail(params: IBase): void
  sendEmailVerification(params: ISendVerificationVerificationParams): void
  sendResetPasswordRequest(params: ISendResetPasswordRequestParams): void
}
