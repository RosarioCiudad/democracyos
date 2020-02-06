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
      {/*<h1 className="number">107.252</h1> */}
      <h1>Elegí la imagen que más te guste de nuestro héroe. La que gane la pintamos en el Pasaje Juramento. #ArribaBelgrano
</h1>
      {/*<h2>Sumate a participar</h2>*/}
        <a href="/consultas">
          <button className='btn btn-primary btn-lg'>
            Votá
          </button>
        </a>
      {/*<div className='follow-arrow'>
        <span onClick={toSteps} className='icon-arrow-down' />
      </div>*/}
    </div>
  </div>
)
//<button onClick={userLoaded ? toInfo : toSteps} className='btn btn-primary btn-lg'>//