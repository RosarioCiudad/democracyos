var express = require('express')
var app = module.exports = express()

app.use(require('../settings/settings'))
app.use(require('lib/settings/forum-new'))