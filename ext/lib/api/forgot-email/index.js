/**
 * Module dependencies.
 */
var express = require('express')
var jwt = require('lib/jwt')



var config = require('lib/config')
var l10n = require('lib/l10n')
var User = require('lib/models').User
//var signup = require('lib/api/signup/lib/signup')

/*var forgotemail = require('./lib/forgotemail')
*/
/**
 * Exports Application
 */

var app = module.exports = express()

/**
 * Define routes for Forgot Password module
 */

app.post('/forgot-email', function (req, res, next) {
  
  var meta = {
    ip: req.ip,
    ips: req.ips,
    host: req.get('host'),
    origin: req.get('origin'),
    referer: req.get('referer'),
    ua: req.get('user-agent')
  }
  var doc = req.body.nro_doc.replace(/[^0-9]/g, '');
  doc = Number(doc)
 

  //req.body.nro_doc = req.body.nro_doc.replace(/[^0-9]/g, '')
  if (!doc) return next()
  if (typeof doc !== 'number') {
    return res.json(500, {
      status: 500,
      error: {
        code: 'SERVER_ERROR',
        message: 'Invalid doc number'
      }
    })
  }
  User
    .find({ 'extra.nro_doc': doc })
    .exec()
    .then(function (users) {
      if (users.length !== 0) {
        return res.json(200, {
          status: 200,
          results: users
        })
      } else {
        res.json(200, {
          status: 400,
          error: {
            code: 'SERVER_ERROR',
            message: 'EL NRO DE DOCUMENTO NO EXISTE',
            docOwner: doc
          }
        })
      }
    })
    .catch(function (err) {
      res.json(500, {
        status: 500,
        error: {
          code: 'SERVER_ERROR',
          message: 'Server Error'
        }
      })
    })
})