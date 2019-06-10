/**
 * Module dependencies.
 */

var express = require('express')
var log = require('debug')('democracyos:settings')
var t = require('t-component')
var restrict = require('lib/utils').restrict
var User = require('lib/models').User

/**
 * Exports Application
 */

var app = module.exports = express()


app.post('/settings/email', restrict, function (req, res) {
  var id = req.body.id

  log('Updating user %s email', id)

  

  User
    .findById(id)
    .exec(function (err, user) {
      if (err) {
        log('Found error %j', err)
        return res.send(500)
      }
      log('Delivering User %j', user)
      user.email = req.body.email
      user.emailValidated = false
      user.save(function (err) {
        if (err) return res.send(500)
        res.send(200)
      })
    })
})