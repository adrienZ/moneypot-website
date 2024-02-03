import { IEmailService } from "./interfaces/IEmailService";
import { Resend } from "resend";
import { useCompiler } from "#vue-email";
interface IBase {
  targetEmail: string;
}

interface IWelcomeParams extends IBase {
  username?: string;
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
  senderAddress = "Adrien <onboarding@resend.dev>";

  async welcomeEmail(params: IWelcomeParams) {
    const emailContent = await useCompiler(
      "welcome.email.vue",
      {
        props: {
          username: params.username
        }
      },
      true
    );

    try {
      const data = await this.resend.emails.send({
        from: this.senderAddress,
        to: [params.targetEmail],
        subject: "Welcome to moneypot website",
        html: emailContent.html
      });

      return data;
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
