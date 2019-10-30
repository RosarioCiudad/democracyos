import React, { Component } from 'react'
import { Link } from 'react-router'
import user from 'lib/site/user/user'
import request from 'lib/request/request'

export default class SignupComplete extends Component {
  constructor (props) {
    super(props)

    const attrs = user.state.value || {}
    const extra = attrs.extra || {}
   
    this.state = {
      error: '',
      loading: false,
      encontrado: false,
      docIngresado: extra.nro_doc || '',
      mensajeNoEncontrado:'',
      sexoEncontrado: '',
      codDocEncontrado: '',
      nombreEncontrado: '',
      apellidoEncontrado: '',
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
  }
  

  buscarPersona() {
      this.setState({
        loading: true
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
              sexoEncontrado: data.sexo,
              codDocEncontrado: data.documento.tipo.abreviatura,
              nombreEncontrado: data.nombre,
              apellidoEncontrado: data.apellido,
              encontrado: true,
              loading: false
            })
          }else{
            var sexo = 'F'
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
                  sexoEncontrado: data.sexo,
                  codDocEncontrado: data.documento.tipo.abreviatura,
                  nombreEncontrado: data.nombre,
                  apellidoEncontrado: data.apellido,
                  encontrado: true,
                  loading: false
                })
              }else{
            this.setState({
              mensajeNoEncontrado: 'No encontramos tu número de documento en el padrón electoral',
              loading: false
            })
          }
        })
      }
    })
  }
    
    guardarInfo(){
      const sexoGuardado = this.state.sexoEncontrado
      const codDocGuardado = this.state.codDocEncontrado
      const docGuardado = this.state.docIngresado
      const data = this.setState(Object.assign(this.state.data,{sexo: sexoGuardado,cod_doc: codDocGuardado,nro_doc: docGuardado}))
      this.setState({ data })
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
            error: `El número de documento ingresado se encuentra utilizado por una cuenta con la dirección de correo ${body.error.docOwner}, si esa dirección no te pertenece o notas algún problema comunicate a participa@rosario.gob.ar`,
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
            <p>Para participar de la votación es requisito que tu domicilio se encuentre en Rosario o alrededores en el último padrón electoral.</p>
          </div>
          <div className='form-fields'>
            {this.state.error && (
              <div className='alert alert-danger error' role='alert'>
                <span dangerouslySetInnerHTML={{
                  __html: this.state.error
                }} />
              </div>
            )}
            <div className='form-group field-nro-doc'>
              <input
                className='form-control custom-select'
                type='text'
                name='nro_doc'
                id='nro_doc'
                maxLength='10'
                onChange={this.handleInputNumberChange}
                value={prettyNumber(this.state.docIngresado)}
                placeholder='Número de documento*'
                required />
            </div>
          </div>
          <div className='persona'>
              {this.state.encontrado && (
                <p>Estas registrado como: <br /> <b>{this.state.nombreEncontrado} {this.state.apellidoEncontrado}</b>.<br />En caso de que haya un error, escribinos a <a href="mailto:participa@rosario.gob.ar">participa@rosario.gob.ar</a></p>
          )}
              {!this.state.encontrado && this.state.mensajeNoEncontrado &&(
                <p><b>{this.state.mensajeNoEncontrado}</b>.<br />Escribinos a <a href="mailto:participa@rosario.gob.ar">participa@rosario.gob.ar</a> para validar tus datos.</p>
          )}
            </div>
          <div className='form-actions'>
             {!user.profileIsComplete() && !this.state.encontrado &&(
              <Link
                onClick={this.buscarPersona}
                className='btn-modal-buscar'
                disabled={this.state.loading}>
                Buscar
              </Link>
            )}
            {!user.profileIsComplete() && this.state.encontrado && (
              <button
                className='btn-modal'
                type='submit'
                disabled={this.state.loading}>
                Enviar datos
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
 