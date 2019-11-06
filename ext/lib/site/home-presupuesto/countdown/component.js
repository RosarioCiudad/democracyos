import React, { Component } from 'react'
import moment from 'moment'
import 'moment-timezone'


export default class Countdown extends Component {
  
  constructor (props) {
    super (props)

    this.state = {
      seconds : 0,
      minutes : 0,
      hours : 0,
      days : 0,
    }
  }
 

  componentDidMount() {
    // inicializa el contador
    this.tick()
    this.timeInterval = setInterval(
      () => this.tick(),
      1000
    )

  }

  componentWillUnmount() {
    // detiene el contador
    clearInterval(this.timeInterval);
  }

  remainingTime = (date) => {
    // calcula la diferencia de milisegundos entre la fecha de cierre y la de ahora
    let t = Date.parse(date) - Date.parse(new Date())

    // calcula cantidad de tiempo
    let seconds = Math.floor( (t/1000) % 60 );
    let minutes = Math.floor( (t/1000/60) % 60 );
    let hours = Math.floor( (t/(1000*60*60)) % 24 );
    let days = Math.floor( t/(1000*60*60*24) )
    return {
      seconds : seconds,
      minutes : minutes,
      hours : hours,
      days : days
    }
  }

  tick = () => {
    // actualiza el contador
    this.setState(this.remainingTime(moment(this.props.cierre).add(3, 'hours')))
  }

  render () {
    return (
      <section className='countdown-wrapper'>
        <div className='intro'>
          <div className='circle'></div>
          <div className='text'>
            <h2>Presupuesto Participativo 2020</h2>
            <p>Vos decidís cómo invertir parte del presupuesto de la ciudad. Podés elegir los proyectos que van a cambiar tu barrio y seguir su ejecución.</p>
          </div>
        </div>
        <main className='countdown'>
          <div className='clock'>
            <span className='number'>{this.state.days >= 0 ? this.state.days : 0}</span>
            <span className='caption'>días</span>
          </div>
          <div className='clock'>
            <span className='number'>{this.state.hours >= 0 ? this.state.hours : 0}</span>
            <span className='caption'>horas</span>
          </div>
          <div className='clock'>
            <span className='number'>{this.state.minutes >= 0 ? this.state.minutes : 0}</span>
            <span className='caption'>minutos</span>
          </div>
          <div className='clock'>
            <span className='number'>{this.state.seconds >= 0 ? this.state.seconds : 0}</span>
            <span className='caption'>segundos</span>
          </div>
        </main>
        <footer>{this.state.seconds >= 0 ? "Para el cierre de la votación" : "Votación Finalizada"}</footer>
      </section>
    )
  }
}