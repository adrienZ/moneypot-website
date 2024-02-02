import { IEmailService } from "./interfaces/IEmailService";
import { Resend } from "resend";
import { useCompiler } from "#vue-email";
import { emailAudience } from "../../database/schema";
interface IBase {
  targetEmail: string;
}

interface ISendVerificationVerificationParams extends IBase {
  code: string;
  pageUrl: string;
}

interface ISendResetPasswordRequestParams extends IBase {
  url: string;
}

export class EmailService implements IEmailService {
  resend = new Resend(process.env.RESEND_API_KEY);

  async welcomeEmail(params: IBase) {
    // const emailContent = await useCompiler(
    //   "signup.email.vue",
    //   {
    //     props: {
    //       username: "John Doe"
    //     }
    //   },
    //   true
    // );

    try {
      // const data = await this.resend.emails.send({
      //   from: 'Acme <onboarding@resend.dev>',
      //   to: [params.targetEmail],
      //   subject: 'Hello world',
      //   html: emailContent.html,
      // });

      return {};
    } catch (error) {
      console.log(error, "WELCOME ", params.targetEmail);
      return { error };
    }
  }

  sendEmailVerification(params: ISendVerificationVerificationParams): void {
    console.log("SEND VERIFICATION CODE " + JSON.stringify(params, null, 2));
  }

  sendResetPasswordRequest(params: ISendResetPasswordRequestParams): void {
    console.log(params.url, "SENDED TO", params.targetEmail);
  }

  async addContact(email: string) {
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
      throw new Error("provider credentials are missing");
    }

    const { data: providerContact } = await this.resend.contacts.create({
      email,
      audienceId
    });

    if (!providerContact) {
      throw new Error("something went wrong with provider response");
    }

    const contact = myAuth.emailAudienceTable.insert({
      email,
      providerContactID: providerContact.id
    });

    return contact;
  }
}
