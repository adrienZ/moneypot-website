import { IEmailService } from "./interfaces/IEmailService";
import { Resend } from "resend"
import { useCompiler } from '#vue-email'

interface IBase {
  targetEmail: string
}

interface ISendVerificationVerificationParams extends IBase {
  code: string
}

interface ISendResetPasswordRequestParams extends IBase {
  url: string
}


export class EmailService implements IEmailService {
  resend = new Resend(process.env.RESEND_API_KEY);


  async welcomeEmail(params: IBase) {
      const emailContent = await useCompiler('signup.email.vue', {
        props: {
          username: 'John Doe',
        }
      }, true)

      try {
        // const data = await this.resend.emails.send({
        //   from: 'Acme <onboarding@resend.dev>',
        //   to: [params.targetEmail],
        //   subject: 'Hello world',
        //   html: emailContent.html,
        // });

        return data;
      } catch (error) {
        console.log(error, "WELCOME ", params.targetEmail)
        return { error };
      }
  }

  sendEmailVerification(params: ISendVerificationVerificationParams): void {
    console.log("SEND VERIFICATION CODE " + JSON.stringify(params, null, 2));
  }

  sendResetPasswordRequest(params: ISendResetPasswordRequestParams): void {
      console.log(params.url, "SENDED TO", params.targetEmail);
  }
}