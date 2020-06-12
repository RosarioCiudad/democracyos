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
{/*          <div className='circle'></div>
*/}          <div className='text'>
            <p>Sé parte de la promesa a la bandera más grande de la historia.</p>
          </div>
        </div>
        <main className='countdown'>
          <div className='clock dias'>
           <div className='circulo'>
             <span className='number'>{this.state.days >= 0 ? this.state.days : 0}</span>
            </div>
           <span className='caption'>días</span>
          </div>
          <div className='clock'>
            <span className='number conborde'>{this.state.hours >= 0 ? this.state.hours : 0}</span>
            <span className='caption'>horas</span>
          </div>
          <div className='clock puntoswrap'>
            <span className='caption dospuntos'>:</span>
          </div>
          <div className='clock'>
            <span className='number conborde'>{this.state.minutes >= 0 ? this.state.minutes : 0}</span>
            <span className='caption'>minutos</span>
          </div>
            <div className='clock puntoswrap'>
            <span className='caption dospuntos'>:</span>
          </div>
          <div className='clock'>
            <span className='number conborde'>{this.state.seconds >= 0 ? this.state.seconds : 0}</span>
            <span className='caption'>segundos</span>
          </div>
        </main>
        <footer>{this.state.seconds >= 0 ? "" : "Sí, prometo!"}</footer>
        {/*<a href="#participa">
          <button className='btn btn-primary btn-lg participa'>
            Participá
          </button>
        </a>*/}

      </section>
    )
  }
}