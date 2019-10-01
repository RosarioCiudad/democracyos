const debug = require('debug')
const express = require('express')
const validate = require('lib/api-v2/validate')

const log = debug('democracyos:ext:api')
const app = module.exports = express()

app.use('/ext/api', require('./participatory-budget'))
app.use('/ext/api/ideas', require('./abrir-cerrar-idea'))
app.use('/ext/api/feed', require('./feed'))
app.use('/ext/api/pp-feed', require('./pp-feed'))
app.use('/ext/api/noticias', require('./noticias'))
app.use('/ext/api/user', require('./user'))
app.use('/api', require('./settings/index'))
app.use('/ext/api/change-stage', require('./change-stage'))
app.use('/api/v2', require('./fixedOpenTopicMethod'))
app.use('/api/v2', require('./customCsvExportUpdate'))
app.use('/api', require('./signup'))
app.use('/api', require('./forgot-email/index'))
app.use('/api', require('./invitaciones/index'))


app.use(function validationErrorHandler (err, req, res, next) {
  if (res.headersSent) return next(err)
  if (!(err instanceof validate.SchemaValidationError)) return next(err)

  res.json(400, {
    status: 400,
    error: {
      code: 'INVALID_REQUEST_PARAMS',
      message: err.message || 'Invalid request parameters.',
      info: err.errors
    }
  })
})

app.use(function apiError (err, req, res, next) {
  if (res.headersSent) return next(err)

  const status = err.status || 500
  const code = err.code || 'SERVER_ERROR'
  const message = err.message || 'Server Error.'

  const method = (req.method || 'GET').toUpperCase()

  if (status === 500) {
    log(`ERROR ${method} ${req.url}`, err)
  }

  res.json(status, {
    status: status,
    error: {
      code: code,
      message: message
    }
  })
})
