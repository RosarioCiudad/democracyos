const express = require('express')

const app = module.exports = express()

app.use(require('../signup-complete'))
app.use(require('../tweets-feed'))
