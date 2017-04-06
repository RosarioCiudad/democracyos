import React from 'react'
import { Link } from 'react-router'

export default function TopicCard (props) {
  const { topic } = props

  const classNames = ['topic-card']

  return (
    <div className={classNames.join(' ')} >
      <div
        className='topic-card-cover'
        style={{ backgroundImage: `url(${topic.coverUrl})` }} />
      <div className='topic-info'>
        <h1 className='title'>
          {topic.mediaTitle}
        </h1>
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
