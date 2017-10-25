import React from 'react'
import user from 'lib/site/user/user'
import padStart from 'string.prototype.padstart'
import { SharerFacebook } from 'ext/lib/site/sharer'

export default function PresupuestoShare ({ topic, forum, user, toggleVotesModal }) {
  const topicUrl = `${window.location.origin}${topic.url}`

  let state
  if (topic.attrs && topic.attrs.state) {
    state = forum.topicsAttrs
      .find((attr) => attr.name === 'state')
      .options
      .find((attr) => attr.name === topic.attrs.state)
      .title
  }
  const stateTitle = forum.topicsAttrs.find((ta) => ta.name === 'state').title
  const anioTitle = forum.topicsAttrs.find((ta) => ta.name === 'anio').title

  const twitterText = twitText()

  const hasVoted = JSON.parse(sessionStorage.getItem('hasVoted'))
  const padron = sessionStorage.getItem('padron')

  function twitText() { 
    switch (topic.attrs.state) {
      case 'pendiente':
        return encodeURIComponent(`Mirá el proyecto que quiero para mi barrio #YoVotoPorMiBarrio `)
      case 'perdedor':
        return encodeURIComponent(topic.mediaTitle)
      case 'proyectado':
        return encodeURIComponent('Este proyecto se va a realizar gracias a la participación de los vecinos. ')
      default:
        return ''
    }
  }

  return (
    <div className='presupuesto-container'>
      {
        topic.attrs.state === 'pendiente' && (
        <aside className='presupuesto-share pendiente'>
          {
            (topic.attrs && topic.attrs.budget) &&
              <div className='sharer-pending'>
                <div className='pending-header'>
                  <span className='presupuesto'>Presupuesto:</span>
                  {topic.attrs.number && <span className='numero-proyecto'>{`${prettyNumber(topic.attrs.number)}`}</span>}
                </div>
                <div className='pending-body'>
                  {topic.attrs.budget && <span className='presu-proyecto'>{prettyPrice(topic.attrs.budget)}</span>}
                  { //User is not logged in
                    !user.state.value &&
                      <a href='/signin' className='btn btn-active btn-pending'>Votar este proyecto</a>
                  }
                  { //User logged in & hasVoted === true
                    (user.state.value && hasVoted) &&
                    <p>Ya vote</p>
                  }
                  { //User is logged in & Profile is not complete
                    (user.state.value && !user.profileIsComplete()) &&
                      <button onClick={completarDatos} className='btn btn-active btn-pending'>Votar este proyecto</button>
                  }
                  { //User logged in, profile complete, not Voted and right padron
                    (user.state.value && user.profileIsComplete() && !hasVoted && topic.attrs.edad === padron) &&
                      <button onClick={toggleVotesModal} className='btn btn-active btn-pending'>Votar este proyecto</button>
                  }
                  { //User logged in, profile complete, not Voted and wrong padron
                    (user.state.value && user.profileIsComplete() && !hasVoted && topic.attrs.edad !== padron) &&
                      <p>No podes votar este padron</p>
                  }
                  
                </div>
              </div>
          }
          <div className='social-links'>
            <span className='hashtag'>#YoVotoPorMiBarrio</span>
            <SharerFacebook
              className='fb'
              params={{
                picture: topic.coverUrl,
                link: window.location.href
              }} />
            <a target='_blank' href={`http://twitter.com/share?text=${twitterText}&url=${topicUrl}`} rel='noopener noreferrer' className='tw'></a>
          </div>
        </aside>
        )
      }
      {
        topic.attrs.state === 'proyectado' &&
        (
        <aside className='presupuesto-share ganador'>
          <div className='box-header'>
            <span>Proyecto ganador</span>
          </div>
          <div className='box-content'>
            <div className='box-content-item'>
              <span className='box-content-title'>Presupuesto asignado:</span>
              <span className='box-content-info'>{prettyPrice(topic.attrs.budget)}</span>
            </div>
            <div className='box-content-item'>
              <span className='box-content-title'>Cantidad de votos:</span>
              <span className='box-content-info'>{topic.attrs.votes}</span>
            </div>
          </div>
          <div className='box-footer'>
            <span className='hashtag'>#YoVotoPorMiBarrio</span>
              <a target='_blank' href={`http://www.facebook.com/sharer.php?u=${topicUrl}`} rel='noopener noreferrer' className='fb'></a>
              <a target='_blank' href={`http://twitter.com/share?text=${twitterText}&url=${topicUrl}`} rel='noopener noreferrer' className='tw'></a>
          </div>
        </aside>
        )
      }
    </div>
  )
}

function prettyNumber (number) {
  if (!number) number = 1
  return `#${padStart(number, 3, '0')}`
}

function prettyPrice (number) {
  return `$${prettyDecimals(number)}`
}

function prettyDecimals (number) {
  if (typeof number === 'number') number = String(number)
  if (typeof number !== 'string') return ''
  if (number.length <= 3) return number

  number = number.split('').reverse().join('').match(/[0-9]{1,3}/g)

  return (number || [])
    .join('.')
    .split('')
    .reverse()
    .join('')
}

 function completarDatos () {
    location.hash = '#completar-datos'
  }