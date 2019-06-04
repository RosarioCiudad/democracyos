/**
 * Module dependencies.
 */

var express = require('express')
var config = require('lib/config')
var l10n = require('lib/l10n')
var User = require('lib/models').User
var signup = require('lib/api/signup/lib/signup')

/**
 * Exports Application
 */

var app = module.exports = express()

/**
 * Define routes for SignUp module
 */

app.post('/signup',
function postSignupCompleteCheckDocDuplication (req, res, next) {
  if (!req.body.extra.nro_doc) return next()
  req.body.extra.nro_doc = Number(req.body.extra.nro_doc)
  if (typeof req.body.extra.nro_doc !== 'number') {
    return res.json(500, {
      status: 500,
      error: {
        code: 'SERVER_ERROR',
        message: 'Invalid doc number'
      }
    })
  }
  User
    .find({ 'extra.nro_doc': req.body.extra.nro_doc })
    .exec()
    .then(function (users) {
      if (users.length === 0) return next()
      let ofuscatedEmail = users[0].email.split('@')
      ofuscatedEmail[0] = ofuscatedEmail[0].split('')[0] + '******'
      ofuscatedEmail = ofuscatedEmail.join('@')
      res.json(200, {
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
function (req, res, next) {
  var meta = {
    ip: req.ip,
    ips: req.ips,
    host: req.get('host'),
    origin: req.get('origin'),
    referer: req.get('referer'),
    ua: req.get('user-agent')
  }

  var profile = req.body
  profile.locale = config.enforceLocale ? config.locale : l10n.requestLocale(req)

  signup.doSignUp(profile, meta, function (err) {
    if (err) return res.status(400).json({ error: err.message })
    return res.status(200).send()
  })
})