import { IEmailService } from "../../../lib/interfaces/IEmailService";

export function defineAuthEmailService(service: IEmailService) {
  return defineNitroPlugin(nitroApp => {
    nitroApp.hooks.hook("request", event => {
      event.context.email = service
    })
  })
}