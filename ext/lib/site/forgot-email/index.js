var express = require('express')
var app = module.exports = express()

app.get('/forgot-email', require('lib/site/layout'))