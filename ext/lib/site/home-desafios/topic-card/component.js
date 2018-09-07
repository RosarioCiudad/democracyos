import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'


export default ({ forum, topic }) => (
  <div className='ext-topic-card desafios-topic-card'>
    {topic.coverUrl && (
      <Link
        to={topic.url}
        className='topic-card-cover'
        style={{ backgroundImage: `url(${topic.coverUrl})` }} />
    )}
    <div className='topic-card-info'>
      <h1 className='topic-card-title'>
        <Link to={topic.url}>{topic.mediaTitle}</Link>
      </h1>
      <div className='participants'>
      <div className='fecha'>{moment(topic.createdAt).format('D/M/YY')}</div>
        {topic.count ? ` ${topic.count} participante${topic.count !== 1 ? 's' : ''}` : ''}
      </div>
    </div>
    <div className='topic-card-footer'>
      <Link to={topic.url} className='btn btn-block btn-primary'>
        Quiero ser parte
      </Link>
    </div>
  </div>
)
