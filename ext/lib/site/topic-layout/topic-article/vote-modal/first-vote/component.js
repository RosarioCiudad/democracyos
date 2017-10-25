import React, { Component } from 'react'
import TopicCard from 'ext/lib/site/home-presupuesto/topic-card/component'

export default ({topic, saveTopic, toggleVotesModal}) => (
	<div className='modal-vote-dialog modal-joven-dialog'>
        <a className='close-modal' onClick={toggleVotesModal}>X</a>
		<div className='form-component-wrapper'>
            <h3>Paso 1 de 2 </h3>
            <p>Una vez confirmado el voto de distrito, debés votar por un proyecto de Área Barrial del mismo. </p>
            <TopicCard topic={topic} />
            <button onClick={saveTopic} className='btn btn-active btn-pending'>Votar este proyecto</button>
            <a className='cancel' onClick={toggleVotesModal}>Cancelar</a>
        </div>
    </div>
	)