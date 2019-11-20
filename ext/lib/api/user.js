const express = require('express')
var config = require('lib/config')
var l10n = require('lib/l10n')
const User = require('lib/models').User
const app = module.exports = express()


app.get('/',
function getUser (req, res, next) {
      User.findOne({ _id: req.query.id })
        .sort({ updatedAt: -1 })
        .exec(function (err, user) {
         if (err) {
          res.json({ result: null, error: err })
          } else {
            res.json({ result: { user } })
          }
        })

    .catch((err) => {
      res.json({ result: null, error: err })
    })
  })

