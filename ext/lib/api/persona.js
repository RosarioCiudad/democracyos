const express = require('express')
const url = require('url')
/*var config = require('lib/config')*/
var l10n = require('lib/l10n')
const request = require('superagent')
const utils = require('lib/utils')
const debug = require('debug')
const config = require('ext/lib/config')

/*const User = require('lib/models').User*/

const log = debug('democracyos:ext:api:persona')
const app = module.exports = express()


app.get('/',
function buscarPersona (req, res, next) {
  const url = config.ext.persona.url + req.query.dni + '/' + req.query.sexo
  console.log(url)
   request
    .get(url)
    .query()
    .end(function statusPersona (err, response) {
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