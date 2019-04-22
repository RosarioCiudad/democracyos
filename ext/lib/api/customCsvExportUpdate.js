const express = require('express')
const debug = require('debug')
const json2csv = require('json-2-csv').json2csv
const csv2json = require('json-2-csv').csv2json
const Topic = require('lib/models').Topic
const middlewares = require('lib/api-v2/middlewares')

const log = debug('democracyos:api:topic:csv')
const app = module.exports = express()

function escapeTxt (text) {
  if (!text) return '-'
  text += ''
  return text.replace(/"/g, '\'').replace(/\r/g, '').replace(/\n/g, '').replace("[",'').replace("]",'').replace('"','')

}

function convertUTCDateToLocalDate(date) {
    var str = date.getUTCFullYear().toString() + "/" +
          (date.getUTCMonth() + 1).toString() +
          "/" + date.getUTCDate() + " " + date.getUTCHours() +
          ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds()
    return str
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
    var infoTopics = []
    const topics = req.topics.sort(sortTopics)

    topics.forEach((topic) => {
      if (topic.attrs === undefined) {
        topic.attrs = {}
      }
      if (topic.action === undefined){
        topic.action = {}
      }
      if(req.forum.name === 'presupuesto'){
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
    }
    


    if(req.forum.name === 'consultas'){
      if(!topic.deletedAt && topic.publishedAt && topic.closingAt){
      
if(topic.action.results.length === 2){
      infoTopics.push([{
      "Consulta": `"${escapeTxt(topic.mediaTitle)}"`,
      "Participantes": `"${escapeTxt(topic.action.count)}"`,
      "Opcion A": `"${escapeTxt(topic.action.results[0].value)}"`,
      "Votos A": `"${escapeTxt(topic.action.results[0].votes)}"`,
      "Porcentaje A": `"${escapeTxt(topic.action.results[0].percentage)}"`,
      "Opcion B": `"${escapeTxt(topic.action.results[1].value)}"`,
      "Votos B": `"${escapeTxt(topic.action.results[1].votes)}"`,
      "Porcentaje B": `"${escapeTxt(topic.action.results[1].percentage)}"`,
      "Opcion C": "-",
      "Votos C": "0",
      "Porcentaje C": "0",
      "Cerrada el": `"${convertUTCDateToLocalDate(topic.closingAt)}"`
      }])
    }else{
      infoTopics.push([{
      "Consulta": `"${escapeTxt(topic.mediaTitle)}"`,
      "Participantes": `"${escapeTxt(topic.action.count)}"`,
      "Opcion A": `"${escapeTxt(topic.action.results[0].value)}"`,
      "Votos A": `"${escapeTxt(topic.action.results[0].votes)}"`,
      "Porcentaje A": `"${escapeTxt(topic.action.results[0].percentage)}"`,
      "Opcion B": `"${escapeTxt(topic.action.results[1].value)}"`,
      "Votos B": `"${escapeTxt(topic.action.results[1].votes)}"`,
      "Porcentaje B": `"${escapeTxt(topic.action.results[1].percentage)}"`,
      "Opcion C": `"${escapeTxt(topic.action.results[2].value)}"`,
      "Votos C": `"${escapeTxt(topic.action.results[2].votes)}"`,
      "Porcentaje C": `"${escapeTxt(topic.action.results[2].percentage)}"`,
      "Cerrada el": `"${convertUTCDateToLocalDate(topic.closingAt)}"`
      }])
    }

    }
    }


    })

    if(req.forum.name === 'presupuesto'){
    json2csv({infoTopics, del: ','}, function (err, csv) {
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
    }, { prependHeader: true })
}


if(req.forum.name === 'consultas'){
    
    //const fields = ['titulo']
    //const json2csvParser = new Json2csvParser({ fields })
    console.log(infoTopics)
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
    }, { prependHeader: true })
}


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
        if (!csvTopic['Jornada'].indexOf('2019')) return Promise.resolve()
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
        
        return Topic.findOne({
          'attrs.anio': anio,
          'attrs.district': distrito,
          'attrs.number': numero,
          'attrs.edad': edad,
          'deletedAt' : null

        })
        .then((topic) => {
          console.log(topic)
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
    }, { delimiter: { field: ',' } })
  })