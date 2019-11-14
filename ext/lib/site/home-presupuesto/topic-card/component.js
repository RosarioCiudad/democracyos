import React from 'react'
import { Link, withRouter } from 'react-router'
import { SharerFacebook } from 'ext/lib/site/sharer'
import distritosData from '../distritos.json'

const distritos = (function () {
  const c = {}
  distritosData.forEach((d) => { c[d.name] = d.title })
  return c
})()

export default withRouter(({ topic, router, fadeTopic, isSelected, isBlocked, stage }) => {
  topic.url = `/presupuesto/topic/${topic.id}`
  const topicUrl = `${window.location.origin}${topic.url}`

  const twitterDesc = twitText()

  let state
  const estadosPP = [
    {
      'name': 'proyectado',
      'title': 'Proyectado'
    },
    {
      'name': 'ejecutandose',
      'title': 'En Ejecución'
    },
    {
      'name': 'terminado',
      'title': 'Terminado'
    }
  ]

  if (topic.attrs && topic.attrs.state && estadosPP.map((e) => e.name).includes(topic.attrs.state)) {
    state = estadosPP.find((attr) => attr.name === topic.attrs.state).title
  }

  if (topic.attrs && topic.attrs.state && topic.attrs.state === 'proyectado' && stage === 'votacion-cerrada') {
    state = 'Ganador'
  }

  const classNames = ['ext-topic-card', 'presupuesto-topic-card']

  function twitText () {
    switch (topic.attrs.state) {
      case 'pendiente':
        return encodeURIComponent(`Mirá el proyecto que quiero para mi barrio #RosarioParticipa `)
      case 'perdedor':
        return encodeURIComponent(topic.mediaTitle)
      case 'proyectado':
        return encodeURIComponent('Este proyecto se va a realizar gracias a la participación de los vecinos. ')
      default:
        return ''
    }
  }

  function chequearClick (goTo) {
    return (e) => {
      const targetClassName = e.target.className
      if (!targetClassName.includes('share') && !targetClassName.includes('block-overlay') && !targetClassName.includes('proyecto-seleccionado')) {
        goTo(topic.url)
      }
    }
  }

  if (topic.extra && typeof topic.extra.votes === 'number') {
    classNames.push('has-votes')
  }

  if (topic.attrs && topic.attrs.state) classNames.push(topic.attrs.state.toLowerCase())
  if (topic.attrs.edad === 'joven') classNames.push('topic-joven')
  if (topic.attrs.area !== '0' && topic.attrs.edad !== 'joven') classNames.push('topic-area')
  if (topic.attrs.area === '0' && topic.attrs.edad !== 'joven') classNames.push('topic-distrito')
  return (
    <div onClick={chequearClick(router.push)} className={classNames.join(' ')}>
      {(fadeTopic || isSelected || isBlocked) && <div className='block-overlay' />}
      {(fadeTopic && !isSelected) && <div className='topic-disabled' />}
      { isSelected && <span className='icon-check proyecto-seleccionado' /> }
      {topic.coverUrl && (
        <div
          className='topic-card-cover'
          style={{ backgroundImage: `url(${topic.coverUrl})` }} />
      )}
      <div className='topic-card-info'>
        {topic.attrs && topic.attrs.state && estadosPP.map((e) => e.name).includes(topic.attrs.state) && (
          <div className='state'>{state}</div>
        )}
        <div className='topic-location'>
          <span className={topic.attrs && topic.attrs.area && topic.attrs.area !== '0' ? 'arealabel' : ''}>{topic.attrs && topic.attrs.area && topic.attrs.area !== '0' ? `Área Barrial ${topic.attrs.area}` : `Distrito ${distritos[topic.attrs.district]}`}</span>
          {topic.attrs && topic.attrs.number && (
            <span className='number'>
              {topic.attrs.anio}
            </span>
          )}
        </div>
        <div className='topic-card-body'>
          <h1 className='topic-card-title'>
            <Link title={topic.mediaTitle} to={topic.url}>{topic.mediaTitle}</Link>
          </h1>
          {topic.attrs && topic.attrs.description && (
            <p className='topic-card-description'>
              <Link to={topic.url}>{topic.attrs.description}</Link>
            </p>
          )}
        </div>
        
        <div className='topic-card-links'>
        {
          window.innerWidth <= 630 &&
          (
          <a target='_blank' href={`whatsapp://send?text=${topicUrl}`} data-action="share/whatsapp/share" rel='noopener noreferrer' className='wh share'> </a>
          )
         }
          <SharerFacebook
            className='fb share'
            params={{
              picture: topic.coverUrl,
              link: topicUrl
            }} />
          <a target='_blank' href={`http://twitter.com/share?text=${twitterDesc}&url=${topicUrl}`} rel='noopener noreferrer' className='tw share'> </a>
        </div>


        <div className='topic-card-footer'>
          <div className='topic-card-category'>
            <span>
              {topic.attrs.edad === 'joven' ? `Joven` : topic.attrs && topic.attrs.area && topic.attrs.area !== '0' ? `Área Barrial` : `Distrito` }
            </span>
          </div>
          {topic.attrs && (
            <p className='budget'>{prettyPrice(topic.attrs.budget)}</p>
          )}
        </div>
      </div>
    </div>
  )
})

function prettyPrice (number) {
  if (!number) number = 1
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
