import React from 'react'
import { Link } from 'react-router'
import { SharerFacebook } from 'ext/lib/site/sharer'

export default function TopicCard (props) {
  const { topic } = props

  const classNames = ['topic-card']

  return (
    <Link
      className={classNames.join(' ')}
      to={topic.url}>
      <div
        className='topic-card-cover'
        style={{ backgroundImage: `url(${topic.coverUrl})` }} />
      <div className='topic-info'>
        <h1 className='title'>{topic.mediaTitle}</h1>
        <div className='topic-card-footer'>
        </div>
      </div>
    </Link>
  )
}

const Sharer = ({ topic }) => {
  const topicUrl = `${window.location.origin}${topic.url}`

  const twitterDesc = encodeURIComponent(`Mirá el proyecto que quiero para mi barrio ${topicUrl} #YoVotoPorMiBarrio`)

  return (
    <div className='social-links'>
      <SharerFacebook
        className='fb'
        params={{ picture: topic.coverUrl, link: topicUrl }} />
      <span
        onClick={handleLinkClick}
        target='_blank'
        href={`http://twitter.com/home?status=${twitterDesc}`}>
        <i className='icon-social-twitter' />
      </span>
    </div>
  )
}

function handleLinkClick (evt) {
  const link = evt.currentTarget
  evt.preventDefault()
  window.open(link.getAttribute('href'), '_blank')
}
