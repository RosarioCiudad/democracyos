import React from 'react'
import { Link } from 'react-router'
import distritosData from 'ext/lib/site/home-presupuesto/distritos.json'

const distritos = (function () {
  const c = {}
  distritosData.forEach((d) => { c[d.name] = d.title })
  return c
})()

export default function TopicCard (props) {
  const { topic } = props

  const classNames = ['topic-card']

  return (
    <div className={classNames.join(' ')} >
      <div
        className='topic-card-cover'
        style={{ backgroundImage: `url(${topic.coverUrl})` }} />
      <div className='topic-info'>
        <div className='topic-location'>
          <i className='icon-location-pin' />
          <span>{topic.extra && topic.extra.area && topic.extra.area !== '0' ? `Área Barrial ${topic.extra.area}` : `Distrito ${distritos[topic.extra.distrito]}`}</span>
        </div>
        <h1 className='title'>{topic.mediaTitle}</h1>
        {topic.extra && topic.extra.description && (
          <p className='description'>{topic.extra.description}</p>
        )}
        <div className='topic-card-footer-container'>
          <div className='topic-card-footer'>
            <div className='comments'>
              <Link to={topic.url}>
                <span>Mas info</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
