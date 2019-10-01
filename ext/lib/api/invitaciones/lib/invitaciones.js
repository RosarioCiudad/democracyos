/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:signup')
var request = require('request')
var t = require('t-component')
/*var notifier = require('democracyos-notifier')*/
var utils = require('lib/utils')
var api = require('lib/db-api')
var config = require('lib/config')
var SignupStrategy = require('lib/signup-strategy')
var emailWhitelisting = require('lib/whitelist-strategy-email')()
var normalizeEmail = require('lib/normalize-email')
var User = require('lib/models').User
//ver esto si esta bien como referenciar al JSON
const correos = require('../correos.json')
/**
 * Sends a new validation email to a user
 *
 * @param {Object} profile object with the email address
 * @param {Obehect} meta user's ip, user-agent, etc
 * @param {Function} callback Callback accepting `err` and `user`
 * @api public
 */
exports.invitacionesEmail = function invitacionesEmail (correo, meta, callback) {
  log('Resend validation email to [%s] requested', correo)
 //ACA VA UN MAP DE CORREOS.JSON
    correos.map((c) => { 
      api.user.getByEmail(c.email, function (err, user) {
        api.token.createEmailValidationToken(user, meta, function (err, token) {
        if (err) return callback(err)
           /* console.log(user.email,",",token.id)*/
        })
      //fin API TOKEN
      })
      //fin metodo
    })
  //fin map
}

