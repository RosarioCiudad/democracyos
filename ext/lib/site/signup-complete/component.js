import React, { Component } from 'react'
import { Link } from 'react-router'
import user from 'lib/site/user/user'
import request from 'lib/request/request'
import PopupCenter from 'ext/lib/open-popup'

export default class SignupComplete extends Component {
  constructor (props) {
    super(props)

    const attrs = user.state.value || {}
    const extra = attrs.extra || {}
   
    this.state = {
      busco: false,
      error: '',
      loading: false,
      encontradoHombre: false,
      encontradoMujer: false,
      docIngresado: extra.nro_doc || '',
      mensajeNoEncontrado:'',
      nombreHombreEncontrado: '',
      apellidoHombreEncontrado: '',
      nombreMujerEncontrado: '',
      apellidoMujerEncontrado: '',
      cod_doc_disabled: !!extra.cod_doc,
      sexo_disabled: !!extra.sexo,
      nro_doc_disabled: !!extra.nro_doc,
      data: {
        cod_doc: extra.cod_doc || '',
        sexo: extra.sexo || '',
        nro_doc: extra.nro_doc || '',
      }
    }
    this.buscarPersona = this.buscarPersona.bind(this)
    this.iniciarSesion = this.iniciarSesion.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.forgot = this.forgot.bind(this)
  }
  

  handleKeyDown = (event) => {
    if(event.keyCode === 13){
      alert('Presionar Buscar')
      event.preventDefault()
    }
  }

  buscarPersona() {
      this.setState({
        loading: true,
        busco: true
      })
     const dni = this.state.docIngresado
     var sexo = 'M'
      return fetch(`/ext/api/persona?dni=${dni}&sexo=${sexo}`,
         {
          method: 'GET',
          credentials: 'same-origin'
        })
      .then((res) => res.json())
        .then((res) => {
          if (res.status !== 200 || !res.results) {
            return { failed: true }
          }
          let data = res.results
          return data
        })
        .then(data => {
          if(data.nombre){

            this.setState({
              nombreHombreEncontrado: data.nombre,
              apellidoHombreEncontrado: data.apellido,
              encontradoHombre: true,
              loading: false
            })
          }
  
            sexo = 'F'
            return fetch(`/ext/api/persona?dni=${dni}&sexo=${sexo}`,
            {
              method: 'GET',
              credentials: 'same-origin'
            })
            .then((res) => res.json())
            .then((res) => {
              if (res.status !== 200 || !res.results) {
                return { failed: true }
              }
              let data = res.results
              return data
            })
            .then(data => {
              if(data.nombre){
                this.setState({
                  nombreMujerEncontrado: data.nombre,
                  apellidoMujerEncontrado: data.apellido,
                  encontradoMujer: true,
                  loading: false
                })
              }

              if (!this.state.encontradoHombre && !this.state.encontradoMujer){
                this.setState({
                mensajeNoEncontrado: 'No encontramos tu número de documento en el padrón electoral',
                loading: false
                })
              }

        })
    })
  }

    guardarInfo(){
        const docGuardado = this.state.docIngresado
        if(this.state.encontradoHombre && !this.state.encontradoMujer){
          const data = this.setState(Object.assign(this.state.data,{sexo: 'M',cod_doc: 'DNI',nro_doc: docGuardado}))
          this.setState({ data })
          }
        if(!this.state.encontradoHombre && this.state.encontradoMujer){
          const data = this.setState(Object.assign(this.state.data,{sexo: 'F',cod_doc: 'DNI',nro_doc: docGuardado}))
          this.setState({ data })
          }
    }

  iniciarSesion(){
    this.props.toggleUserModal()
    user.logout()
    window.location.href= "/signin?ref=%2Fpresupuesto"
  }

  forgot(){
    this.props.toggleUserModal()
    user.logout()
    window.location.href= "/forgot"
  }

  openPopup = (e) => {
        e.preventDefault()
        this.props.toggleUserModal()
        let url = 'https://www.rosario.gov.ar/form/id/actualizar-email'
         PopupCenter(url, '', 500, 600)
       }

  handleForm = (evt) => {
    evt.preventDefault()
    this.setState({
      error: '',
      loading: true
    })
    
    this.guardarInfo()
    const datos= this.state.data 
   
       /*location.reload()*/
    user.saveExtraData(datos).then(() => {
      this.setState({
        error: '',
        loading: false
      })

      user.update(Object.assign({}, user.state.value, {
        extra: datos
      }))

    this.props.toggleUserModal()

      // browserHistory.push('/')
    }).catch((err) => {
      console.log(err)
      /*this.props.toggleUserModal()*/
      err.res.json().then((body) => {
        if (!body) throw err
        if (body.error && body.error.code === 'DUPLICATED_VOTING_DATA') {
          this.setState({
            error: `El número de documento ${this.state.docIngresado} ya se encuentra asignado a la cuenta ${body.error.docOwner}.`,
            loading: false
          })
        } else {
          throw err
        }
      }).catch(() => {
        this.setState({
          error: 'Hubo un error guardando la información, intente de nuevo por favor.',
          loading: false
        })
      })
    })
  }


    handleInputChange = (evt) => {
      const input = evt.target
      if(input.value=='F'){
        this.setState({
          encontradoHombre: false
        })
      } else{
        this.setState({
          encontradoMujer: false
        })
      }
  }

  handleInputNumberChange = (evt) => {
    const input = evt.target
    const value = input.value.replace(/[^0-9]/g, '')
    const data = Object.assign({}, this.state.data, { nro_doc: value })
    this.setState({ docIngresado: value }, () => {
      // arregla movimiento del cursor mientras se escribe, en android
      const displayValue = prettyNumber(value)
      setTimeout(() => input.setSelectionRange(displayValue.length, displayValue.length), 0)
    })
  }

  render () {
    return (
      <div className='ext-signup-complete'>
        {this.state.loading && <div className='loader' />}
        <form role='form' onSubmit={this.handleForm} method='POST'>
          <div className='form-header'>
            <h3 className='title'>Completá tus datos</h3>
            {!this.state.error && (
            <p>Para participar de la votación es requisito que tu domicilio se encuentre en Rosario o alrededores en el último padrón electoral.</p>
            )}
          </div>
          <div className='form-fields'>
            {this.state.error && (
              <div className='alert alert-danger error' role='alert'>
                <span dangerouslySetInnerHTML={{
                  __html: this.state.error
                }} />
              </div>
            )}
            {!this.state.error && (
            <div className='form-group field-nro-doc'>
              <input
                className='form-control custom-select'
                type='text'
                name='nro_doc'
                id='nro_doc'
                maxLength='10'
                onChange={this.handleInputNumberChange}
                onKeyDown={this.handleKeyDown}
                value={prettyNumber(this.state.docIngresado)}
                placeholder='Número de documento*'
                required />
            </div>
          )}          
              {this.state.encontradoHombre && this.state.encontradoMujer && this.state.busco && (
                <div className='form-group field-sexo'>
                  <div className='form-select-wrapper'>
                    <select
                      className='form-control custom-select field-sexo'
                      name='sexo'
                      id='sexo'
                      value={this.state.data.sexo}
                      onChange={this.handleInputChange}
                      //disabled={this.state.loading || this.state.sexo_disabled}
                      required>
                      <option className='opcion' value='' disabled>Seleccioná tu Nombre*</option>
                      <option className='opcion' value='M'>{this.state.nombreHombreEncontrado + this.state.apellidoHombreEncontrado}</option>
                      <option className='opcion' value='F'>{this.state.nombreMujerEncontrado + this.state.apellidoMujerEncontrado}</option>
                    </select>
                  </div>
                </div>
            )}
          </div>
          <div className='persona'>
              {this.state.busco && this.state.encontradoHombre && !this.state.encontradoMujer && !this.state.error && (
                <p>Estas registrado como: <br /> <b>{this.state.nombreHombreEncontrado} {this.state.apellidoHombreEncontrado}</b>.<br />En caso de que haya un error, escribinos a <a href="mailto:participa@rosario.gob.ar">participa@rosario.gob.ar</a></p>
          )}
              {this.state.busco && !this.state.encontradoHombre && this.state.encontradoMujer && !this.state.error && (
                <p>Estas registrado como: <br /> <b>{this.state.nombreMujerEncontrado} {this.state.apellidoMujerEncontrado}</b>.<br />En caso de que haya un error, escribinos a <a href="mailto:participa@rosario.gob.ar">participa@rosario.gob.ar</a></p>
          )}
              {this.state.mensajeNoEncontrado &&(
                <p><b>{this.state.mensajeNoEncontrado}</b>.<br />Escribinos a <a href="mailto:participa@rosario.gob.ar">participa@rosario.gob.ar</a> para validar tus datos.</p>
          )}
            </div>
          <div className='form-actions'>
             {!user.profileIsComplete() && !this.state.encontradoHombre && !this.state.encontradoHombre && !this.state.busco &&(
              <Link
                onClick={this.buscarPersona}
                className='btn-modal-buscar'
                disabled={this.state.loading}>
                Buscar
              </Link>
            )}

            {!user.profileIsComplete() && (this.state.encontradoHombre || this.state.encontradoMujer) && this.state.error &&(
              <div className='iniciosesion'>
                <p>Si esa cuenta te pertenece:</p>
                <button
                  className='btn-modal iniciobtn'
                  onClick={this.iniciarSesion}>
                  Inicia sesión
                </button>
                <p>Si ya no utilizás esa cuenta: <a className="linksolicita" onClick={this.openPopup} href='#'>Solicitá un cambio.</a></p>
                <p>Si no recordás tu contraseña: 
                <Link
                  onClick={this.forgot}
                  className='linkforgot'>
                  Modificala.
              </Link>
              </p>              
              </div>
            )}

            {!user.profileIsComplete() && (this.state.encontradoHombre || this.state.encontradoMujer) && !this.state.error &&(
              <button
                className='btn-modal'
                type='submit'
                disabled={this.state.loading}>
                Continuar
              </button>
            )}

            {!user.profileIsComplete() && (
              <Link
                onClick={this.props.toggleUserModal}
                className='complete-later'>
                Cancelar
              </Link>
            )}
          </div>

        </form>

      </div>
    )
  }
}

function prettyNumber (number) {
  if (typeof number !== 'string') return ''
  return (number
    .split('')
    .reverse()
    .join('')
    .match(/[0-9]{1,3}/g) || [])
    .join('.')
    .split('')
    .reverse()
    .join('')
}
 