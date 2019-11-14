const express = require('express')
const middlewares = require('lib/api-v2/middlewares')
const validate = require('lib/api-v2/validate')
const User = require('lib/models').User

const app = module.exports = express()

app.get('/signup/complete', require('lib/site/layout'))

app.post('/signup/complete',
middlewares.users.restrict,
validate({
  payload: {
    cod_doc: {
      type: 'string',
      required: true,
      enum: ['DNI', 'LC', 'LE']
    },
    sexo: {
      type: 'string',
      enum: ['M', 'F'],
      required: true
    },
    nro_doc: {
      type: 'string',
      format: 'numeric',
      required: true
    }
  }
}, {
  filter: true
}),
function postSignupCompleteParseData (req, res, next) {
  const user = req.user

  user.extra = user.extra || {}

  const data = req.extraData = {
    'extra.cod_doc': req.body.cod_doc,
    'extra.sexo': req.body.sexo,
    'extra.nro_doc': Number(req.body.nro_doc)

  }

  const modifying = Object.keys(data).find((key) => {
    return user.extra[key] && user.extra[key] !== data[key]
  })
  
  if (modifying) {
    res.json(400, {
      status: 400,
      error: {
        code: 'CANT_MODIFY_EXTRA_DATA',
        message: 'Extra data of user profile cant be modified.'
      }
    })
  } else {
    next()
  }
},
function postSignupCompleteCheckDocDuplication (req, res, next) {
  User
    .find({ 'extra.nro_doc': req.extraData['extra.nro_doc'] })
    .exec()
    .then(function (users) {
      if (users.length === 0) return next()
      let ofuscatedEmail = users[0].email.split('@')
      ofuscatedEmail[0] = ofuscatedEmail[0].substring(0, 5) + '******'
      console.log(ofuscatedEmail[0])
      ofuscatedEmail = ofuscatedEmail.join('@')

      res.json(400, {
        status: 400,
        error: {
          code: 'DUPLICATED_VOTING_DATA',
          docOwner: ofuscatedEmail
        }
      })
    })
    .catch(function (err) {
      console.error(err)

      res.json(500, {
        status: 500,
        error: {
          code: 'SERVER_ERROR',
          message: 'Server Error'
        }
      })
    })
},
function postSignupComplete (req, res) {
  Object.keys(req.extraData).forEach((k) => {
    req.user.set(k, req.extraData[k])
  })

  req.user.save(function (err, user) {
    if (err) {
      console.error(err)

      return res.json(500, {
        status: 500,
        error: {
          code: 'SERVER_ERROR',
          message: 'Server Error'
        }
      })
    }

    res.json(200, {
      status: 200,
      results: {
        extra: req.extraData
      }
    })
  })
})

app.use(function validationErrorHandler (err, req, res, next) {
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
