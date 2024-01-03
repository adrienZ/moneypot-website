import { Resend } from "resend"
import { useCompiler } from '#vue-email'

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineAuthEmailService({
  async welcomeEmail(params) {
    const emailContent = await useCompiler('signup.vue', {
      props: {
        username: 'John Doe',
      }
    })

    try {
      const data = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [params.targetEmail],
        subject: 'Hello world',
        html: emailContent.html,
      });

      return data;
    } catch (error) {
      return { error };
    }
  }
})