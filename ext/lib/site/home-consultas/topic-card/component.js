import React from 'react'
import { Link } from 'react-router'
import Poll from 'lib/site/topic-layout/topic-article/poll/component'
import { SharerFacebook } from 'ext/lib/site/sharer'

export default function TopicCard (props) {
  const { forum, topic } = props

  const classNames = ['topic-card']

  return (
    <div className={classNames.join(' ')} >
      <div
        className='topic-card-cover'
        style={{ backgroundImage: `url(${topic.coverUrl})` }} />
      <div className='topic-info'>
        <h1 className='title'>{topic.mediaTitle}<Link to={topic.url}>Más info</Link></h1>
        {topic.action.method && topic.action.method === 'poll' && (
          <Poll
            topic={topic}
            canVoteAndComment={forum.privileges.canVoteAndComment} />
        )}
        {/*
        <div className='topic-card-footer'>
        </div>
        */}
      </div>
    </div>
  )
}

// const Sharer = ({ topic }) => {
//   const topicUrl = `${window.location.origin}${topic.url}`
//
//   const twitterDesc = encodeURIComponent(`Mirá el proyecto que quiero para mi barrio ${topicUrl} #YoVotoPorMiBarrio`)
//
//   return (
//     <div className='social-links'>
//       <SharerFacebook
//         className='fb'
//         params={{ picture: topic.coverUrl, link: topicUrl }} />
//       <span
//         onClick={handleLinkClick}
//         target='_blank'
//         href={`http://twitter.com/home?status=${twitterDesc}`}>
//         <i className='icon-social-twitter' />
//       </span>
//     </div>
//   )
// }
//
// function handleLinkClick (evt) {
//   const link = evt.currentTarget
//   evt.preventDefault()
//   window.open(link.getAttribute('href'), '_blank')
// }
