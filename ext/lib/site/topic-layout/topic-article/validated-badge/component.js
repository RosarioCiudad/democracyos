import React from 'react'

export default function ValidatedBadge (props) {
  const {comment} = props

  if (!comment.author.extra || !comment.author.extra.validated) return null

  return (
    <div className='validated-badge'>
      <i className='icon-check'></i>
      <div className='validated-label'>
        <span>{comment.author.extra.label}</span>
      </div>
    </div>
  )
}
