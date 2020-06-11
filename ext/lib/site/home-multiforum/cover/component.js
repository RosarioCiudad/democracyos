import React from 'react'
import { Link } from 'react-router'
import videos from './videos.json'
import PopupCenter from 'ext/lib/open-popup'

const video = videos[Math.floor(Math.random() * videos.length)]

export default ({ userLoaded, toSteps, toInfo }) => (

  <div className='ext-home-cover' style={{
    backgroundImage: `url("${video.image}")`
  }}>
    {

 /*     window.innerWidth >= 768 && (
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
    )*/}
    <div className='container'>
      {/*<h1 className="number">107.252</h1> */}
      <h1>La promesa más grande de la historia</h1>
      {/*<h2>Sumate a participar</h2>*/}
        <a href="#" onClick={openPopup}>
          <button className='btn btn-primary btn-lg botonslider'>
            ¡SÍ, PROMETO!
          </button>
        </a>
      {/*<div className='follow-arrow'>
        <span onClick={toSteps} className='icon-arrow-down' />
      </div>*/}
    </div>
  </div>
)
//<button onClick={userLoaded ? toInfo : toSteps} className='btn btn-primary btn-lg'>//

function openPopup (e){
        e.preventDefault()
        let url = 'https://www.rosario.gob.ar/form/id/si_prometo'
        PopupCenter(url, '', 500, 600)
       }