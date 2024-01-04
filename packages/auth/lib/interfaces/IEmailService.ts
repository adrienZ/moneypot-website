interface IBase {
  targetEmail: string
}

interface ISendVerificationVerificationParams extends IBase {
  code: string
}

export interface IEmailService {
  welcomeEmail(params: IBase): void
  sendEmailVerification(params: ISendVerificationVerificationParams): void
}
