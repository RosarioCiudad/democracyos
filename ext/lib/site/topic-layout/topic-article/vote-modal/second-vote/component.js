import React from 'react'
import TopicCard from 'ext/lib/site/home-presupuesto/topic-card/component'

export default ({ proyectos, sendTopics, toggleVotesModal }) => (
  <div className='modal-vote-dialog'>
    <a className='close-modal' onClick={toggleVotesModal}>X</a>
    <div className='form-component-wrapper'>
      <h3>Paso 2 de 2 </h3>
      <p>Presioná CONFIRMAR MI VOTO para finalizar.</p>
      <div className='proyectos-container'>
        {proyectos.map((p, i) => <TopicCard key={i} topic={p} isBlocked />)}
      </div>
      <button onClick={sendTopics(proyectos)} className='btn btn-active btn-pending'>Confirmar mi voto</button>
      <a className='cancel' onClick={toggleVotesModal}>Cancelar</a>
    </div>
  </div>
)