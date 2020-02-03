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
      <h1>Sumá tus ideas para el año de Belgrano</h1>
      {/*<h2>Sumate a participar</h2>*/}
        <a href="/ideas">
          <button className='btn btn-primary btn-lg'>
            Quiero proponer
          </button>
        </a>
      {/*<div className='follow-arrow'>
        <span onClick={toSteps} className='icon-arrow-down' />
      </div>*/}
    </div>
  </div>
)
//<button onClick={userLoaded ? toInfo : toSteps} className='btn btn-primary btn-lg'>//