import React, { Component } from 'react'
import userConnector from 'lib/site/connectors/user'
import bus from 'bus'

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

export default function ppHOC(Layout) {
  class PPStatus extends Component {
    _fetchingStatus = false
    componentWillReceiveProps ({ user: { state } }) {
      this.manageStatus(state)
    }

    componentWillMount () {
      const { user: { state } } = this.props
      bus.on('refresh-status', () => this.manageStatus(state))
    }

    tokenExpired (tokenDate) {
      if (!tokenDate) return true
      const unaHora = 60 * 60 * 1000
      const delta = ((new Date()) - new Date(tokenDate))
      return delta > unaHora
    }

    manageStatus (userState) {
      if (userState.pending) return

      if (userState.fulfilled) {
        let ppStatus = JSON.parse(localStorage.getItem('ppStatus')) || {}
        let cambioUser = false
        if (ppStatus.id !== userState.value.id) {
          bus.emit('pp-status', {})
          localStorage.removeItem('ppStatus')
          cambioUser = true
        }

        if (!this._fetchingStatus && (this.tokenExpired(ppStatus.createdAt) || cambioUser)) {
          this._fetchingStatus = true

          this.makeStatus(userState.value.id)
            .then((status) => {
              this._fetchingStatus = false
              if (status.failed) {
                bus.emit('pp-status', {})
                localStorage.removeItem('ppStatus')
              } else {
                localStorage.setItem('ppStatus', JSON.stringify(status))
                bus.emit('pp-status', status)
              }
            })
            .catch((err) => {
              this._fetchingStatus = false
              bus.emit('pp-status', {})
              localStorage.removeItem('ppStatus')
            })
        }
      } else {
        bus.emit('pp-status', {})
        localStorage.removeItem('ppStatus')
      }
    }

    makeStatus (id) {
      return fetch(
        '/ext/api/participatory-budget/status',
        {
          method: 'GET',
          credentials: 'same-origin'
        })
        .then((res) => res.json())
        .then((res) => {
          if (res.status !== 200 || !res.results) {
            return { failed: true }
          }
          return res.results
        })
        .then((status) => {
          if (status.failed) return status
          let ppStatus = {}
          
          ppStatus.id = id
          ppStatus.createdAt = new Date()
          ppStatus.puede_votar = status.puede_votar
          ppStatus.msj = status.mensaje_aclaratorio
          ppStatus.padron = status.padron_adulto && status.padron_joven ? 'mixto' : status.padron_adulto ? 'adulto' : status.padron_joven ? 'joven' : ''
        
          return ppStatus
        })
        .catch((err) => {
          console.log(err)
          return { failed: true }
        })
    }

    render () {
      return <Layout {...this.props} />
    }
  }
  return userConnector(PPStatus)
}
