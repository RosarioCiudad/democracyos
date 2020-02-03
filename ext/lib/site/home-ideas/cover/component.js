import React from 'react'
import { Link } from 'react-router'
import videos from './videos.json'

const video = videos[Math.floor(Math.random() * videos.length)]

export default ({ userLoaded, toSteps, toInfo }) => (
  <div className='ext-home-cover' style={{
    backgroundImage: `url("${video.image}")`
  }}>
    {window.innerWidth >= 768 && (
      <div className='banner'>
        <div className='video'>
          <video
            playsInline
            autoPlay
            muted
            loop
            poster={video.image}
            id='bgvid'>
            <source src={video.video} type='video/mp4' />
          </video>
        </div>
      </div>
    )}
      <div className='container'>
        <div
          className='ext-site-cover-isologo'
          style={{ backgroundImage: `url('/ext/lib/site/home-multiforum/ideas_belgrano.svg')` }} />
        <div>    
        <h1>Ideas para el año de Belgrano</h1>
          <h2>Queremos que la ciudad celebre a la Bandera y a su creador, en todos sus rincones. Sumate a esta agenda colectiva!</h2>
        </div>
      </div>
    </div>
)