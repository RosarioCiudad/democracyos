import React from 'react'
import { SharerFacebook } from 'ext/lib/site/sharer'

export default ({ edad, toggleVotesModal }) => (
  <div className='modal-confirmation'>
    <a className='close-modal' onClick={toggleVotesModal}>X</a>
    <div className='confirmation-wrapper'>
      <div className='vote-img' />
      <h3 className='confirmation-title'>¡Tu voto fue registrado!</h3>
      <p>Gracias por participar</p>
      <p className='sharing-text'>¡Invitá a otros a votar!</p>
      <div className='social-sharing'>
        <a target='_blank' href='whatsapp://send?text=Ya elegí mis proyectos del Presupuesto Participativo 2020 de Rosario. Elegí vos también entrando a https://participa.rosario.gob.ar/presupuesto' data-action="share/whatsapp/share" rel='noopener noreferrer' className='wh'> </a>
        <SharerFacebook
          className='fb'
          params={{
            link: window.location.origin + '/presupuesto'
          }} />
        <a target='_blank' href='http://twitter.com/share?text=Ya elegí mis proyectos del Presupuesto Participativo 2020 de Rosario. Elegí vos también entrando a https://participa.rosario.gob.ar/presupuesto' rel='noopener noreferrer' className='tw'></a>
      </div>
      <a className='return' href='/presupuesto'>Volver a los proyectos</a>
    </div>
  </div>
)