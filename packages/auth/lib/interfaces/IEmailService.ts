interface IBase {
  targetEmail: string
}

export interface IEmailService {
  welcomeEmail(params: IBase): void
}
