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
          <h2>Presupuesto Participativo 2017</h2>
          <h1>Ya elegiste los proyectos<br/>que van a cambiar tu barrio</h1>
          <Link to='/presupuesto' className='btn call-to-action btn-lg'>
            Ver los proyectos
          </Link>
        </div>
      </div>
      <div className='intro'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <h2 className='section-subtitle'>Últimas noticias</h2>
              <p className='light-text'>Este año participaron del Presupuesto Participativo un total de <strong>93.300 rosarinos</strong>. Del 18 al 28 de noviembre votaron un proyecto para su barrio y otro para su distrito, 66.718 ciudadanos.</p>

              <p className='light-text'>En el Presupuesto Participativo Joven participaron 26.582 jóvenes y cada uno pudo elegir tres proyectos para su distrito.</p>

              <p className='light-text'>El distrito que más votantes de Presupuesto Participativo registró, fue el Oeste con un total de 16.009 votantes y le siguieron Distrito Centro (13.557), Distrito Sudoeste (11.072), Distrito Norte (10.021), Distrito Noroeste (8.342) y Distrito Sur (7.717).</p>

              <p className='light-text'>En este portal, recibimos 5035 votos y 609 comentarios a los proyectos y, en adelante, será el espacio donde podrás seguir el avance de los que resultaron ganadores.</p>

              <p className='light-text'><strong>Gracias por sumarte a cambiar tu lugar.</strong></p>
              <Link
                to='http://www.rosarionoticias.gob.ar/page/noticias/tag/Presupuesto%20Participativo'
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-primary mas-info'>
                Ver Noticias
              </Link>
            </div>
            <div className='col-md-6 video-container'>
              <div className='video'>
                <iframe
                  sandbox='allow-scripts allow-same-origin'
                  src='https://www.youtube.com/embed/aKvwzNaW1Bc'></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='info'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <h2 className='section-title'>Votación actual 2016</h2>
              <h2>Presupuesto Participativo 2017</h2>
              <p>En las últimas semanas, vecinos de todos los distritos priorizaron los nuevos proyectos para mejorar nuestra ciudad.</p>
              <ul className='proyectos-stats'>
                <li>
                  <span className='img'></span>
                  <span className='num'>134</span>
                  <p>Proyectos<br />presentados</p>
                </li>
                <li>
                  <span className='img'></span>
                  <span className='num'>207 millones</span>
                  <p>Presupuesto<br />asignado</p>
                </li>
                <li>
                  <span className='img'></span>
                  <span className='num'>56</span>
                  <p>Proyectos<br />ganadores</p>
                </li>
              </ul>
              <Link
                to='/presupuesto'
                className='btn ver-mas'>
                Ver proyectos
              </Link>
            </div>
            <div className='col-md-6 linea-tiempo'>
              <ul>
                <li className='highlighted'>
                  <h4>2016</h4>
                  <span>- Ejecución del presupuesto votado en 2015</span>
                </li>
                <li>
                  <h4>Mayo - Junio 2016</h4>
                  <span>- Reuniones de vecinos en todos los barrios</span>
                  <span>- Elección de Consejeros</span>
                  <span>- Formación de los Consejos Participativos</span>
                </li>
                <li>
                  <h4>Julio - Octubre 2016</h4>
                  <span>- Elaboración de proyectos en los Consejos Participativos</span>
                </li>
                <li>
                  <h4>Noviembre 2016</h4>
                  <span>- Presentación y votación de los proyectos</span>
                </li>
                <li className='highlighted'>
                  <h4>2017</h4>
                  <span>- Ejecución del presupuesto 2017</span>
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
