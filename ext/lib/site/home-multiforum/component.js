import React from 'react'
import {Link} from 'react-router'
import config from 'lib/config'
import TweetsFeed from '../tweets-feed/component'

export default function HomeMultiforumOverride (props) {
  const videos = config.ext.homeVideos
  const randomVideoSrc = videos[Math.floor(Math.random() * videos.length)]

  return (
    <div className='ext-home-multiforum'>
      <div className='ext-home-cover'>
        <div className='banner'>
          <div className='video'>
            <video
              playsInline
              autoPlay
              muted
              loop
              poster='/ext/lib/site/home-multiforum/bg-cover.png'
              id='bgvid'>
              <source src={randomVideoSrc} type='video/mp4' />
            </video>
          </div>
        </div>
        <div className='container'>
          <h2>Presupuesto Participativo 2017</h2>
          <h1>Votá los proyectos que van<br /> a cambiar tu barrio</h1>
          <Link to='/presupuesto' className='btn call-to-action btn-lg'>
            Quiero decidir
          </Link>
        </div>
      </div>
      <div className='intro'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <p className='light-text'>Del 18 al 28 de noviembre podés elegir un proyecto para tu barrio y uno para tu distrito.</p>
              <p className='light-text'>Y hasta el 28 de noviembre tenés tiempo para votar en el Presupuesto Participativo Joven.</p>
              <p className='light-text'>El presupuesto total es de 207 millones que se dividirá en proyectos para tu barrio y proyectos para jóvenes.</p>
              <p className='light-text'>Los proyectos surgen de las reuniones de Consejos Barriales, fueron presentados por los consejeros electos y trabajados con los equipos del distrito.</p>
              <Link
                to='/s/terminos-y-condiciones'
                className='btn btn-primary mas-info'>
                Más información
              </Link>
            </div>
            <div className='col-md-6 video-container'>
              <div className='video'>
                <iframe src='https://www.youtube.com/embed/j-4NvQnCCC8'></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='info'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <span className='en-curso'>En curso (votado en 2015)</span>
              <h2>Presupuesto Participativo 2016</h2>
              <p>El año pasado, vecinos de todos los distritos priorizaron los proyectos para nuestra ciudad.</p>
              <ul className='proyectos-stats'>
                <li>
                  <span className='img'></span>
                  <span className='num'>302</span>
                  <p>Proyectos<br />presentados</p>
                </li>
                <li>
                  <span className='img'></span>
                  <span className='num'>155 millones</span>
                  <p>Presupueso<br />asignado</p>
                </li>
                <li>
                  <span className='img'></span>
                  <span className='num'>176</span>
                  <p>Proyectos<br />votados</p>
                </li>
              </ul>
              <Link
                to='http://www.rosario.gob.ar/web/gobierno/presupuestos/presupuesto-participativo'
                target='_blank'
                rel='noopener noreferrer'
                className='btn ver-mas'>
                Ver más resultados
              </Link>
            </div>
            <div className='col-md-6 linea-tiempo'>
              <ul>
                <li>
                  <h4>Marzo - Abril 2015</h4>
                  <span>- Reuniones de vecinos en todos los barrios</span>
                  <span>- Elección de Consejeros</span>
                  <span>- Formación de los Consejos Participativos</span>
                </li>
                <li>
                  <h4>Mayo - Octubre 2015</h4>
                  <span>- Elaboración de proyectos en los Consejos Participativos</span>
                </li>
                <li>
                  <h4>Noviembre 2015</h4>
                  <span>- Presentación y votación de los proyectos</span>
                </li>
                <li>
                  <h4>Diciembre 2015</h4>
                  <span>- Presentación de balance de ejecución de lo votado en 2014</span>
                  <span>- Presentación de los proyectos elegidos por los vecinos</span>
                </li>
                <li>
                  <h4>2016</h4>
                  <span>- Ejecución del presupuesto</span>
                </li>
              </ul>
            </div>
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
