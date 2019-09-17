import React from 'react'
import { Link } from 'react-router'

export default ({ scrollInfo }) => (
  <div className='ext-home-steps'>
    <div className='container'>
      <div className='row'>
        <h2 className='container'>¿Cómo votar?</h2>
        <div className='participa-steps'>
          <div className='p-step'>
            <div>
              <span className='num'>1</span>
              <p>Elegí tu distrito.</p>
            </div>
            {/*<Link to='/signin' className='p-text'>
              Hacé click en <span className="color-link">Ingresar</span>,
              completá el formulario y sé
              parte de Rosario Participa.
            </Link>*/}
          </div>
          <div className='p-step' onClick={scrollInfo} style={{ cursor: 'pointer' }}>
            <div>
              <span className='num'>2</span>
              <p>Seleccioná un proyecto para tu distrito.</p>
            </div>
            {/*<p className='p-text'>
              Opiná, proponé y decidí cómo
              querés que sea la ciudad.
            </p>*/}
          </div>
          <div className='p-step'>
            <div>
              <span className='num'>3</span>
              <p>Seleccioná un proyecto para tu barrio.</p>
            </div>
            {/*<p className='p-text'>
              Compartí en redes sociales
              para que más rosarinos
              puedan aportar sus opiniones.
            </p>*/}
          </div>
        </div>
        <div>
        <p className='p-mensaje'>Para participar de la votación es requisito que tu <b>domicilio</b> se encuentre en <b>Rosario</b> en el último padrón electoral. En caso de que haya un error, escribinos a <a href="mailto:participa@rosario.gob.ar">participa@rosario.gob.ar</a>.</p>
        </div>      
      </div>
    </div>
  </div>
)
