import { IEmailService } from "~/lib/interfaces/IEmailService";

type H3Event = Parameters<Parameters<typeof defineEventHandler>[0]>[0]

const defaultEmailService:IEmailService  = {
  welcomeEmail(params) {
    console.log("WELCOME ", params.targetEmail)
  },
}
export function useEmailService(h3Event: H3Event) {
	return h3Event.context.email || defaultEmailService;
}