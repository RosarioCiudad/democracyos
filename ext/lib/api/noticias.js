const express = require('express')
const Forum = require('lib/models').Forum
const Topic = require('lib/models').Topic
const Tag = require('lib/models').Tag

const app = module.exports = express()


app.get('/',
function getNoticias (req, res, next) {
  Forum.findOne({ name: 'noticias' })
    .then((forum) => {
      Tag.findOne({ name: req.query.tagName })
         .then((tag) => {
        Topic.findOne({ forum: forum._id, publishedAt: { $ne: null }, deletedAt: null, tag: tag._id})
        .sort({ updatedAt: -1 })
        .exec(function (err, topic) {
         if (err) {
          res.json({ result: null, error: err })
          } else {
            res.json({ result: { topic } })
          }
      })
    })
    })

    .catch((err) => {
      res.json({ result: null, error: err })
    })
  })