import React, {Component} from 'react'
import {Link} from 'react-router'
import user from 'lib/site/user/user'
import userConnector from 'lib/site/connectors/user'
import {SharerFacebook} from 'ext/lib/site/sharer'
import fetchStatus from './fetch-status'
import moment from 'moment'

/*

mensaje.estado.0 = Invocaci&oacute;n incorrecta.
mensaje.estado.1 = Se encuentra habilitado para votar.
mensaje.estado.2 = Ya participaste con este documento.
mensaje.estado.3 = Lo sentimos, tus datos no se encuentran en el padr&oacute;n de votantes habilitados, \
pod&eacute;s dirigirte a tu Centro Municipal de Distrito o consultar a: <a href='yoparticipo@rosario.gob.ar'>yoparticipo@rosario.gob.ar</a>.
mensaje.estado.10 = El período de votación no ha comenzado todavía.
#El per&iacute;odo de votaci&oacute;n se inicia el 6/11 a las 8:00hs.
mensaje.estado.11 = Se encuentra en el período de votación.
mensaje.estado.12 = El período de votación ha finalizado.

 */

const closingDate = Date.parse('Tue, 29 Nov 2016 11:00:00 GMT-0300')

class VotingModule extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      message: '',
      error: null
    }
  }

  componentDidMount () {
    this.fetchVotingData()
  }

  componentWillReceiveProps () {
    this.fetchVotingData()
  }

  fetchVotingData = () => {
    const props = this.props

    if (Date.now() >= closingDate) {
      return this.setState({loading: true})
    }

    // return this.setState({
    //   loading: false,
    //   message: <VotingSuccess />
    // })
    // return this.setState({
    //   loading: false,
    //   message: (<Link
    //     to='/ext/api/participatory-budget/vote'
    //     className='btn btn-lg btn-block btn-primary'>
    //     Votar
    //   </Link>)
    // })

    if (props.user.state.pending) {
      return this.setState({loading: true})
    }

    if (props.user.state.rejected) {
      return this.setState({
        loading: false,
        error: null,
        message: (
          <div className='voting-action' role='alert'>
            <Link
              to={{pathname: '/signin', query: {ref: location.pathname}}}
              className='btn btn-lg btn-outline-secondary'>
              Ingresar y Votar
            </Link>
            <p>¡Tenés tiempo hasta el 28 de noviembre!</p>
          </div>
        )
      })
    }

    if (!user.profileIsComplete()) {
      return this.setState({
        loading: false,
        error: null,
        message: (
          <div className='voting-action' role='alert'>
            <Link
              to={{pathname: '/signup/complete', query: {ref: location.pathname}}}
              className='btn btn-lg btn-outline-secondary'>
              Quiero Votar
            </Link>
            <p>¡Tenés tiempo hasta el 28 de noviembre!</p>
          </div>
        )
      })
    }

    this.setState({loading: true})

    fetchStatus().then((body) => {
      const codigo = body.results.codigo_mensaje

      if (!codigo) {
        const err = new Error('Código inválido.')
        err.body = body
        throw err
      }

      let msg

      if (codigo === 1 || codigo === 11) {
        msg = (
          <Link
            to='/ext/api/participatory-budget/vote'
            className='btn btn-lg btn-block btn-primary'>
            Votar
          </Link>
        )
      } else if (codigo === 2) {
        msg = <VotingSuccess />
      } else if (codigo === 3) {
        msg = (
          <div className='alert alert-info' role='alert'>
            Lo sentimos, tus datos no se encuentran en el padrón de votantes habilitados. Podés dirigirte a tu Centro Municipal de Distrito o consultar a: <a href='mailto:participa@rosario.gob.ar'>participa@rosario.gob.ar</a>.
          </div>
        )
      } else {
        msg = (
          <Link
            to='/ext/api/participatory-budget/vote'
            className='btn btn-lg btn-block btn-primary'>
            Votar
          </Link>
        )
      }

      this.setState({
        loading: false,
        error: null,
        message: msg
      })
    }).catch(() => {
      this.setState({
        loading: false,
        message: null,
        error: (
          <div className='alert alert-danger error' role='alert'>
            ¡Lo sentimos! Hubo un error verificando tu perfil de votación. Volvé a probar mas tarde o contactanos en <a href='mailto:participa@rosario.gob.ar'>participa@rosario.gob.ar</a>
          </div>
        )
      })
    })
  }

  render () {
    if (this.state.loading) return null
    if (!this.state.error && !this.state.message) return null

    return (
      <div className='ext-voting-module'>
        {this.state.error}
        {this.state.message}
      </div>
    )
  }
}

export default userConnector(VotingModule)

class VotingSuccess extends Component {
  hidden = false

  constructor (props) {
    super(props)

    this.state = {
      hidden: VotingSuccess.hidden
    }
  }

  handleCloseClick = (evt) => {
    VotingSuccess.hidden = true
    this.setState({hidden: true})
  }

  render () {
    if (this.state.hidden) return null

    return (
      <div className='voting-success' role='alert'>
        <div className='text'>
          <h1>¡Gracias por tu Voto!</h1>
          <span>Compartilo con tus vecinos</span>
        </div>
        <span className='btn-close' onClick={this.handleCloseClick}>
          <i className='icon-close' />
        </span>
        <div className='social-links'>
          <SharerFacebook
            params={{
              picture: 'https://cldup.com/1ZhVXvP3RF.jpg',
              link: 'https://participa.rosario.gob.ar/presupuesto',
              name: 'Rosario Participa',
              description: 'Votá en el Presupuesto Participativo entrando a participa.rosario.gob.ar. Sumate a mejorar tu lugar #YoVotoPorMiBarrio'
            }} />
            <a
              target='_blank'
              href={`http://twitter.com/home?status=${encodeURIComponent('Ya voté en el Presupuesto Participativo. Entrá y sumate a mejorar tu lugar #YoVotoPorMiBarrio @RParticipa https://participa.rosario.gob.ar/presupuesto')}`}>
              <i className='icon-social-twitter' />
            </a>
          </div>
          <a
            className='survey'
            target='_blank'
            rel='noopener noreferrer'
            href='https://democracyos.typeform.com/to/F3oBGE'>
            <p>Dejanos tu opinión, clic aquí.</p>
          </a>
        </div>
      )
    }
}
