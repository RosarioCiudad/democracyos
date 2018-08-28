import React from 'react'
import { prettyPrice, twitText, prettyNumber } from './utils.js'

export default ({ topic, forum }) => {
  const topicUrl = `${window.location.origin}${topic.url}`
  const stateTitle = forum.topicsAttrs.find((ta) => ta.name === 'state').title
  const anioTitle = forum.topicsAttrs.find((ta) => ta.name === 'anio').title
  let state
  if (topic.attrs && topic.attrs.state) {
    state = forum.topicsAttrs
      .find((attr) => attr.name === 'state')
      .options
      .find((attr) => attr.name === topic.attrs.state)
      .title
  }

  if (topic.attrs && topic.attrs.state && topic.attrs.state === 'proyectado' && forum.extra.stage === 'votacion-cerrada') {
    state = 'Ganador'
  }

  return (
    <aside className='presupuesto-share ganador'>
      {state && (state !== 'Perdedor') && (
        <div className='box-header'>
          <span> {`${stateTitle}: ${state}`}</span>
        </div>
      )}
      <div className='box-content'>
        {
          topic.attrs && (
            <div className='box-content-item'>
              {topic.attrs.number && <span className='numero-proyecto'>{`${prettyNumber(topic.attrs.number)}`}</span>}
              {topic.attrs.anio && <span className='anio-proyecto'><span className='box-content-bold'>{`${anioTitle}:`}</span> {`${topic.attrs.anio}`}</span> }
              {topic.attrs.district && <span><span className='box-content-bold'>Distrito:</span> {`${topic.attrs.district}`}</span> }
              {(topic.attrs.area && topic.attrs.area !== "0") && <span><span className='box-content-bold'>Area:</span> {`${topic.attrs.area}`}</span> }
              {topic.attrs.budget && <span className='presu-proyecto'><span className='box-content-bold'>Presupuesto asignado:</span> {`${prettyPrice(topic.attrs.budget)}`}</span>}
            </div>
          )
        }
        <div className='box-content-item'>
          <span className='box-content-title'>Cantidad de votos:</span>
          <span className='box-content-info'>{topic.attrs.votes}</span>
        </div>
      </div>
      <div className='box-footer'>
        <span className='hashtag'>#YoVotoPorMiBarrio</span>
        <a target='_blank' href={`whatsapp://send?text=${topicUrl}`} data-action="share/whatsapp/share" rel='noopener noreferrer' className='wh'> </a>
        <a target='_blank' href={`http://www.facebook.com/sharer.php?u=${topicUrl}`} rel='noopener noreferrer' className='fb'> </a>
        <a target='_blank' href={`http://twitter.com/share?text=${twitText()}&url=${topicUrl}`} rel='noopener noreferrer' className='tw'> </a>
         
      </div>
    </aside>
  )
}
