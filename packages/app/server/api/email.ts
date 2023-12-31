import { Resend } from 'resend';
import { useCompiler } from '#vue-email'

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async () => {
  // try {

  //   return data;
  // } catch (error) {
  //   return { error };
  // }

    const template = await useCompiler('email.vue', {
      props: {
        username: 'John Doe',
      }
    })


    if (!template) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
      })
    }

    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['adrienzaganelli@gmail.com'],
      subject: 'Hello world',
      html: template.html,
    });

    return template

});
