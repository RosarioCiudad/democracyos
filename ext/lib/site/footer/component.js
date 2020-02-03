import React from 'react'
import { Link } from 'react-router'

export default () => (
  <footer className='container-fluid ext-footer'>
    <div className='disclaimer'>
      <p>
        Desarrollado con software libre por la Municipalidad de Rosario.
      </p>
      <Link to='/s/terminos-y-condiciones'><b>Términos y condiciones</b></Link>
      <span className='spacer'>|</span>
      <a href='http://www.rosario.gov.ar/form/id/contacto_institucional_persona/50' target='_blank' rel='noopener noreferrer'><b>Contacto</b></a>
    </div>
    <div className='footer-logos'>
        <a href='https://rosario.gob.ar' target='_blank' rel='noopener noreferrer'>
      {/*<a href='http://democraciaenred.org' target='_blank' className='democracy' rel='noopener noreferrer' />*/}
          <img src="/ext/lib/site/home-multiforum/logo_negativo.svg" width="200" height="130"/>
       </a>
    </div>
  </footer>
)
