const express = require('express')
const middlewares = require('lib/api-v2/middlewares')
const Forum = require('lib/models').Forum
const debug = require('debug')

const log = debug('democracyos:ext:api:change-stage')

const app = module.exports = express()

app.post('/',
middlewares.users.restrict,
middlewares.forums.findFromBody,
middlewares.forums.privileges.canEdit,
function changeStage (req, res, err) {
	log('POST/api/change-stage')
	const possibleStages = ['votacion-abierta', 'votacion-cerrada', 'seguimiento']
	let futureStage = req.body.stage
	//let futureCierre = new Date(req.body.cierre)

	if (possibleStages.includes(futureStage)) {
		Forum.findOneAndUpdate(
			{'_id': req.forum.id},
			{$set:
				{extra: 
					{stage: futureStage}
					 //cierre: futureCierre}
			
				}
			})
		.then((forum)=> {
			log('Forum stage changed successfully.')
			res.json({
				status: 200,
				message: forum.extra.stage
			})
    		res.end()
		}) 
	} else {
		log('Error: Wrong forum stage value.')
		res.status(400)
		res.end()
	}
})


