import React from 'react'
import padStart from 'string.prototype.padstart'
import {Link} from 'react-router'
import {SharerFacebook} from 'ext/lib/site/sharer'

export default function TopicCard (props) {
  const {topic} = props

  const topicUrl = `${location.origin}${topic.url}`

  const twitterDesc = encodeURIComponent(`Mirá el proyecto que quiero para mi barrio ${topicUrl} #YoVotoPorMiBarrio`)

  const classNames = ['topic-card']

  if (topic.extra && typeof topic.extra.votes === 'number') {
    classNames.push('has-votes')
  }

  if (topic.extra && topic.extra.winner) classNames.push('is-winner')

  return (
    <Link
      className={classNames.join(' ')}
      to={topic.url}>
      {topic.extra && topic.extra.number && (
        <div className='number'>{prettyNumber(topic.extra.number)}</div>
      )}
      <div
        className='topic-card-cover'
        style={{backgroundImage: `url(${topic.coverUrl})`}} />
      {topic.extra && typeof topic.extra.votes === 'number' && (
        <div className='topic-results'>
          <h2>{prettyDecimals(topic.extra.votes)} Votos</h2>
          <p>
            Proyecto {topic.extra && topic.extra.winner ? 'ganador' : 'presentado'}
          </p>
        </div>
      )}
      <div className='topic-info'>
        <h1 className='title'>{topic.mediaTitle}</h1>
        {topic.extra && topic.extra.description && (
          <p className='description'>{topic.extra.description}</p>
        )}
        <div className='topic-card-footer'>
          <div className='social-links'>
            <SharerFacebook
              className='fb'
              params={{picture: topic.coverUrl, link: topicUrl}} />
            <span
              onClick={handleLinkClick}
              target='_blank'
              href={`http://twitter.com/home?status=${twitterDesc}`}>
              <i className='icon-social-twitter' />
            </span>
          </div>
          {topic.extra && topic.extra.budget && (
            <p className='budget'>{prettyPrice(topic.extra.budget)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

function prettyNumber (number) {
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

function handleLinkClick (evt) {
  const link = evt.currentTarget
  evt.preventDefault()
  window.open(link.getAttribute('href'), '_blank');
}
