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
        <a target='_blank' href={`whatsapp://send?text=${encodeURIComponent(`Ya voté en el Presupuesto Participativo 2019 de Rosario. Participá entrando aquí! #RosarioParticipa`)}&url=${window.location.origin}+${encodeURIComponent(`/presupuesto`)}`} data-action="share/whatsapp/share" rel='noopener noreferrer' className='wh'> </a>
        <SharerFacebook
          className='fb'
          params={{
            link: window.location.origin + '/presupuesto'
          }} />
        <a target='_blank' href={`http://twitter.com/share?text=${encodeURIComponent(`Ya voté en el Presupuesto Participativo 2019 de Rosario. Participá entrando aquí! #RosarioParticipa`)}&url=${window.location.origin}+${encodeURIComponent(`/presupuesto`)}`} rel='noopener noreferrer' className='tw'></a>
      </div>
      <a className='return' href='/presupuesto'>Volver a los proyectos</a>
    </div>
  </div>
)