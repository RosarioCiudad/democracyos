const url = require('url')
const express = require('express')
const debug = require('debug')
const jwt = require('jwt-simple')
const request = require('superagent')
const config = require('ext/lib/config')
const utils = require('lib/utils')
const middlewares = require('lib/api-v2/middlewares')

const log = debug('democracyos:ext:api:participatory-budget')

const app = module.exports = express()

app.get('/participatory-budget/status',
middlewares.users.restrict,
function validateUserCanVoteMiddleware (req, res, next) {
  if (userCanVote(req.user)) return next()

  const err = new Error('Falta completar el perfil de votación.')
  err.code = 'MISSING_VOTING_PROFILE'
  err.status = 400
  next(err)
},
function getParticipatoryBudgetStatus (req, res, next) {
  log('GET /api/participatory-budget/status')

  let token

  try {
    token = getUserStatusToken(req.user)
  } catch (err) {
    return next(err)
  }

  request
    .get(config.ext.participatoryBudget.statusEndpoint)
    .query({ token: token })
    .end(function statusEndpointCall (err, response) {
      if (err || !response.ok) return next(err)

      try {
        const body = JSON.parse(response.text)

        res.json(200, {
          status: 200,
          results: body
        })
      } catch (err) {
        next(err)
      }
    })
})

app.get('/participatory-budget/vote-platform',
  middlewares.users.restrict,
  function validateUserCanVoteMiddleware (req, res, next) {
    if (userCanVote(req.user)) return next()
    res.redirect('/')
  },
  function getParticipatoryBudgetStatus (req, res) {
    log('GET /api/participatory-budget/vote-platform')

    try {
      const token = getUserStatusToken(req.user)
      const endpoint = url.parse(config.ext.participatoryBudget.votingEndpoint, true)

      endpoint.query.token = token

      res.redirect(url.format({
        protocol: endpoint.protocol,
        host: endpoint.host,
        pathname: endpoint.pathname,
        query: endpoint.query,
        hash: endpoint.hash
      }))
    } catch (err) {
      log('ERROR /api/participatory-budget/vote-platform encoding token', err)
      return res.redirect('/500')
    }
  })

app.post('/participatory-budget/vote',
middlewares.users.restrict,
function validateUserCanVoteMiddleware (req, res, next) {
  if (userCanVote(req.user)) return next()
  res.redirect('/presupuesto')
},
function getParticipatoryBudgetVote (req, res, next) {
  log('GET /api/participatory-budget/status')

  let token

  const voteData = {
    modalidad: req.body.modalidad,
    distrito: req.body.distrito,
    proyectos_distritales: req.body.proyectos_distritales + '',
    proyectos_barriales: req.body.proyectos_barriales + ''
  }

  try {
    token = getUserVotingToken(req.user, voteData)
  } catch (err) {
    return next(err)
  }

  console.log(`${config.ext.participatoryBudget.votingEndpoint}?accion=votar&token=${token}`)

  request
    .get(config.ext.participatoryBudget.votingEndpoint)
    .query({ token: token, accion: 'votar' })
    .end(function statusEndpointCall (err, response) {
      if (err || !response.ok) return next(err)
      console.log(response.text)
      try {
        const body = JSON.parse(response.text)
        if (body.resultado === 'ERROR') {
          return next(body.mensaje_aclaratorio)
        }
        res.json(200, {
          status: 200,
          results: body
        })
      } catch (err) {
        next(err)
      }
    })
})

function userCanVote (user) {
  return !!(
    user &&
    user.extra &&
    user.extra.cod_doc &&
    user.extra.nro_doc &&
    user.extra.sexo
  )
}

const exposeProfileAttributes = utils.expose([
  'id',
  'firstName',
  'lastName',
  'fullName',
  'email',
  'avatar',
  'extra.cod_doc',
  'extra.nro_doc',
  'extra.sexo'
])

function exposeProfile (user) {
  const json = exposeProfileAttributes(user)

  Object.assign(json, json.extra)
  delete json.extra

  return json
}

function getUserStatusToken (user) {
  let userProfile = exposeProfile(user)
  userProfile.nro_doc = +userProfile.nro_doc
  return jwt.encode(userProfile, config.ext.participatoryBudget.secret)
}

function getUserVotingToken (user, voteData) {
  console.log(user)
  const userProfile = exposeProfile(user)
  return jwt.encode({
    modalidad: voteData.modalidad,
    distrito: voteData.distrito,
    proyectos_distritales: voteData.proyectos_distritales,
    proyectos_barriales: voteData.proyectos_barriales,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    email: userProfile.email,
    cod_doc: userProfile.cod_doc,
    nro_doc: +userProfile.nro_doc,
    sexo: userProfile.sexo
  }, config.ext.participatoryBudget.secret)
}
