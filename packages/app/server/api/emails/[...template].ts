import { useCompiler } from '#vue-email'

export default eventHandler(async event => {
  // cast as string because /emails list all the templates
  const template  = event.context.params?.template as string
  const props = getQuery(event)

  const rendered = await useCompiler(template + '.email.vue', {
    props
  })

  if (!rendered) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    })
  }

  return rendered.html;
});