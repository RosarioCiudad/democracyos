/**
 * Module dependencies.
 */
var express = require('express')
var config = require('lib/config')
var api = require('lib/db-api')
var jwt = require('lib/jwt')
var l10n = require('lib/l10n')

var setDefaultForum = require('lib/middlewares/forum-middlewares').setDefaultForum
var initPrivileges = require('lib/middlewares/user').initPrivileges
var canCreate = require('lib/middlewares/user').canCreate
var canManage = require('lib/middlewares/user').canManage
var invitaciones = require('./lib/invitaciones')

/**
 * Exports Application
 */

var app = module.exports = express()


app.post('/invitaciones', function (req, res) {
  var meta = {
    ip: req.ip,
    ips: req.ips,
    host: req.get('host'),
    origin: req.get('origin'),
    referer: req.get('referer'),
    ua: req.get('user-agent')
  }
  
  invitaciones.invitacionesEmail(req.body, meta, function (err) {
    if (err) return res.status(200).json({ error: err.message })
    return res.status(200).send()
  })
})