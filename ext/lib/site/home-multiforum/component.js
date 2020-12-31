import React from 'react'
import { Link } from 'react-router'
import userConnector from 'lib/site/connectors/user'
import TweetsFeed from '../tweets-feed/component'
import Footer from '../footer/component'
import Anchor from '../anchor'
import Cover from '../cover/index'
import Steps from './steps/component'
import Countdown from './countdown/component'
import Feed from './feed/component'
import Noticias from './noticias/component'
import SliderView from './slider/component'

export default userConnector(({ user }) => {
  return (
    <div className='ext-home-multiforum'>
      
      <Cover
      background='/ext/lib/site/boot/bg-home-forum.jpg'
      logo='/ext/lib/site/home-multiforum/presupuesto-icono.png'
      title='Presupuesto Participativo'
      description={<span>La Municipalidad quiere conocer tu opinión sobre<br />diferentes temáticas de nuestra Ciudad.</span>} />
      {/*<Countdown
            cierre={'2020-06-20T12:00:00.000Z'} />*/}
      <Anchor id='participar' />
      <Noticias tagName="home" />
      {/*<Steps scrollInfo={() => Anchor.goTo('info')} />*/}
      <Anchor className='info' id='info'>
        {/*<div className='action action-ideas'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Ideas</h3>
            <p>¿Tenés ideas para mejorar la vida en la ciudad? Compartilas.</p>
            <Link to='/ideas' className='btn btn-primary btn-lg'>Quiero proponer</Link>
          </div>
        </div>*/}
       {/* <div className='action action-presupuesto'>
          <div className='action-img' />
            <div className='action-content'>
              <h3>Presupuesto Participativo</h3>
                <p>Vos decidís cómo invertir parte del presupuesto de la ciudad. Podés elegir los proyectos que van a cambiar tu barrio y seguir su ejecución.</p>
              <Link to='/presupuesto' className='btn btn-primary btn-lg'>Quiero decidir</Link>
            </div>
        </div>*/}
        {/*<div className='action action-consulta'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Consultas</h3>
            <p>Queremos conocer tu opinión sobre diferentes temas. Elegí la mejor opción para la ciudad.</p>
            <Link to='/consultas' className='btn btn-primary btn-lg'>Quiero opinar</Link>
          </div>
        </div>
        <div className='action action-desafio'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Desafíos</h3>
            <p>Tenemos desafíos como comunidad y podemos resolverlos juntos.</p>
            <Link to='/desafios' className='btn btn-primary btn-lg'>Quiero ser parte</Link>
          </div>
        </div>
        <div className='action action-voluntariado'>
          <div className='action-img' />
          <div className='action-content'>
            <h3>Voluntariado social</h3>
            <p>Muchas organizaciones sociales buscan tu apoyo! Conocé a quienes trabajan por una ciudad mejor.</p>
            <Link to='/voluntariado' className='btn btn-primary btn-lg'>Quiero sumarme</Link>
          </div>
        </div>*/}
      </Anchor>
      <TweetsFeed />
      <Footer />
    </div>
  )
})
