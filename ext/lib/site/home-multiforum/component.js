import React from 'react'
import {Link} from 'react-router'
import config from 'lib/config'
import TweetsFeed from '../tweets-feed/component'
import videos from './videos.json'

export default function HomeMultiforumOverride (props) {
  const video = videos[Math.floor(Math.random() * videos.length)]

  return (
    <div className='ext-home-multiforum'>
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
          <h1>Queremos que seas parte de las decisiones:</h1>
          <p>Las opiniones y las acciones colectivas mejoran la ciudad.
            <br />
            Participá y mejoremos juntos la ciudad.</p>
          <Link to='/signin' className='btn call-to-action btn-lg'>
            Participá
          </Link>
          <span className='icon-arrow-down'></span>
        </div>
      </div>
      <div className='pasos'>
        <div className='container'>
          <div className='row'>
            <h2>¿Cómo podés participar?</h2>
            <div className='participa-steps'>
              <div className='p-step'>
                <div>
                  <span className='num'>1</span>
                  <p>Registrate</p>
                </div>
                <p className='p-text'>
                  Hacé click en Participá,
                  completá el formulario y sé
                  parte de Rosario Participa.
                </p>
              </div>
              <div className='p-step'>
                <div>
                  <span className='num'>2</span>
                  <p>Votá</p>
                </div>
                <p className='p-text'>
                  Elegí, debatí y proponé cómo
                  querés que sea la ciudad.
                </p>
              </div>
              <div className='p-step'>
                <div>
                  <span className='num'>3</span>
                  <p>Compartí</p>
                </div>
                <p className='p-text'>
                  Compartí en redes sociales
                  para que más vecinos
                  puedan aportar sus ideas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='info'>
        <div className='action action-consulta'>
          <div className='action-img'></div>
          <div className='action-content'>
            <h3>Consultas</h3>
            <h4>La Municipalidad quiere conocer tu opinion sobre diferentes temas</h4>
            <span className='action-separador'></span>
            <p>Podés votar y decidir qué acciones impulsa la Municipalidad en temáticas culturales, ambientales, sociales.</p>
            <Link to='/consulta'>Quiero opinar</Link>
          </div>
        </div>
        <div className='action action-desafio'>
          <div className='action-img'></div>
          <div className='action-content'>
            <h3>Desafíos</h3>
            <h4>Tenemos desafíos como comunidad y podemos resolverlos juntos.</h4>
            <span className='action-separador'></span>
            <p>Sé parte de las politicas de la ciudad: resolvamos en conjunto los desafíos que tenemos.</p>
            <Link to='/desafios'>Quiero ser parte</Link>
          </div>
        </div>
        <div className='action action-presupuesto'>
          <div className='action-img'></div>
          <div className='action-content'>
            <h3>Presupuesto participativo</h3>
            <h4>Vos podes decidir sobre cómo invertir mas de 200 millones de pesos para la ciudad.</h4>
            <span className='action-separador'></span>
            <p>Elegí los proyectos que transformarán tu barrio.</p>
            <Link to='/presupuesto'>Quiero votar</Link>
          </div>
        </div>
        <div className='action action-voluntariado'>
          <div className='action-img'></div>
          <div className='action-content'>
            <h3>Voluntariado social</h3>
            <h4>¡Muchas organizaciones buscan tu apoyo!</h4>
            <span className='action-separador'></span>
            <p>Conocé las organizaciones sociales que impulsan una ciudad más justa y solidaria y contactate con ellos.</p>
            <Link to='/voluntariado'>Quiero sumarme</Link>
          </div>
        </div>
      </div>
      <TweetsFeed />
      <footer className='container-fluid'>
        <div className='disclaimer'>
          <p>
            Desarrollado con software libre por la Municipalidad de Rosario y DemocracyOS
          </p>
          <Link to='/s/terminos-y-condiciones'>Términos y condiciones</Link>
          <span className='spacer'>|</span>
          <a href='mailto:participa@rosario.gob.ar'>Contacto</a>
        </div>
        <div className='footer-logos'>
          <a href='#' className='democracy'></a>
          <a href='#' className='rosario'></a>
        </div>
      </footer>
    </div>
  )
}
