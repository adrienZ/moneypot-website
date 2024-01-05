import { IEmailService } from "~/lib/interfaces/IEmailService";

type H3Event = Parameters<Parameters<typeof defineEventHandler>[0]>[0]

const defaultEmailService:IEmailService  = {
  welcomeEmail(params) {
    console.log("WELCOME ", params.targetEmail)
  },
  sendEmailVerification(params) {
    console.log("SEND VERIFICATION CODE " + JSON.stringify(params, null, 2));
  },
  sendResetPasswordRequest(params) {
      console.log(params.url, "SENDED TO", params.targetEmail);
  },
}
export function useEmailService(h3Event: H3Event): IEmailService {
	return h3Event.context.email || defaultEmailService;
}