const express = require('express')
const debug = require('debug')
const json2csv = require('json-2-csv').json2csv
const csv2json = require('json-2-csv').csv2json
const Topic = require('lib/models').Topic
const middlewares = require('lib/api-v2/middlewares')

const log = debug('democracyos:api:topic:csv')
const app = module.exports = express()

function escapeTxt (text) {
  if (!text) return ''
  text += ''
  return text.replace(/"/g, '\'').replace(/\r/g, '').replace(/\n/g, '')
}

function sortTopics (a, b) {
  if (a.attrs.edad === b.attrs.edad) {
    if (a.attrs.district === b.attrs.district) {
      return a.attrs.number > b.attrs.number ? 1 : -1
    } else {
      return a.attrs.district > b.attrs.district ? 1 : -1
    }
  } else {
    return a.attrs.edad > b.attrs.edad ? 1 : -1
  }
}

app.get('/topics.csv',
  middlewares.users.restrict,
  middlewares.forums.findByName,
  middlewares.topics.findAllFromForum,
  middlewares.forums.privileges.canChangeTopics,
  function getCsv (req, res, next) {
    const infoTopics = []
    const topics = req.topics.sort(sortTopics)

    topics.forEach((topic) => {
      if (topic.attrs === undefined) {
        topic.attrs = {}
      }
      if (topic.attrs.anio === '2019') {
        infoTopics.push([
          `"${escapeTxt(topic.attrs.district)}"`.toUpperCase(),
          `"${escapeTxt(topic.attrs.number)}"`,
          `"${escapeTxt(topic.mediaTitle)}"`,
          `"${escapeTxt(topic.attrs.area)}"`,
          `"${escapeTxt(topic.attrs.budget)}"`,
          `"${escapeTxt('DESCONOCIDO')}"`,
          `"${escapeTxt(topic.attrs.description)}"`,
          `"${topic.coverUrl}"`,
          `"${escapeTxt(topic.attrs.edad.charAt(0).toUpperCase() + (topic.attrs.edad).slice(1).toLowerCase())}"`,
          //agrego estado
          `"${escapeTxt(topic.attrs.state)}"`
        ])
      }
    })

    json2csv(infoTopics, function (err, csv) {
      if (err) {
        log('get csv: array to csv error', err)
        return res.status(500).end()
      }
      res.status(200)
      res.set({
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename=${req.forum.name.replace(/\s/g, '-')}-${Math.floor((new Date()) / 1000)}.csv`
      })
      res.write(csv)
      res.end()
    }, { prependHeader: false })
  })

app.post('/topics.csv',
  middlewares.users.restrict,
  middlewares.forums.findFromQuery,
  middlewares.forums.privileges.canChangeTopics,
  function postCsv (req, res) {
    const body = req.body.csv
    csv2json(body, function (err, csvTopics) {
      if (err) {
        log('get csv: array to csv error', err)
        return res.status(500).end()
      }

      Promise.all(csvTopics.map((csvTopic) => {
        if (!~csvTopic['Jornada'].indexOf('2019')) return Promise.resolve()
        Object.keys(csvTopic).forEach((csvKey) => {
          if (csvKey.indexOf('/r')) {
            csvTopic[csvKey.replace(/\r/g, '')] = csvTopic[csvKey]
          }
        })
        const anio = '2019'
        const distrito = csvTopic['Nombre Distrito'].toLowerCase()
        const numero = +csvTopic[' Numero Proyecto']
        const jornada = csvTopic['Jornada'] || ''
        const edad = ~jornada.toLowerCase().indexOf('joven')
          ? 'joven'
          : ~jornada.toLowerCase().indexOf('adulto')
            ? 'adulto'
            : null
        const state = csvTopic['Estado']
        return Topic.findOne({
          'attrs.anio': anio,
          'attrs.district': distrito,
          'attrs.number': numero,
          'attrs.edad': edad,
//agrego estado
          'attrs.state': state

        })
        .then((topic) => {
          if (!topic) return
          const state = ~csvTopic[' incluido (SI/NO)'].indexOf('SI')
            ? 'proyectado'
            : ~csvTopic[' incluido (SI/NO)'].indexOf('NO')
              ? 'perdedor'
              : null
          topic.set('attrs.votes', +csvTopic[' Cantidad Votos'])
          topic.set('attrs.state', state)
          return topic.save()
        })
      }))
      .then((topics) => {
        res.status(200).end()
      })
      .catch((err) => {
        log('post csv: find and modify topic from csv error', err)
        res.status(500).end()
      })
    }, { delimiter: { wrap: '"' } })
  })
