import React, { Component } from 'react'
import t from 't-component'
import FormAsync from 'lib/site/form-async'

import { Link } from 'react-router'
import bus from 'bus'
import config from 'lib/config'
import PopupCenter from 'ext/lib/open-popup'



export default class ForgotEmail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      errors: null,
      nro_doc: '',
      success: false,
      email: ''
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.onFail = this.onFail.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.openPopup = this.openPopup.bind(this)
  }

  componentWillMount () {
    this.setState({ success: false })
  }

  onSubmit (data) {
    this.setState({ loading: true })
    }

  onSuccess (res) {
    console.log(res)
    this.setState({
      email: res.results[0].email,
      loading: false,
      success: true,
      errors: null
    })
  }

  onFail (err) {
    if (err[0].code === 'SERVER_ERROR') {
      err[0].message = [`El número de documento no se encuentra registrado`]
  this.setState({ loading: true, errors: err })
   }
  }

  openPopup = (e) => {
    e.preventDefault()
    let url = 'https://www.rosario.gov.ar/form/id/actualizar-email'
    PopupCenter(url, '', 500, 600)
  }

   handleInputNumberChange = (evt) => {
    const input = evt.target
    const value = input.value.replace(/[^0-9]/g, '')
   /* const data = Object.assign({}, this.state.nro_doc, { nro_doc: value })*/
    this.setState({ nro_doc: value }, () => {
      // arregla movimiento del cursor mientras se escribe, en android
      const displayValue = prettyNumber(value)
      setTimeout(() => input.setSelectionRange(displayValue.length, displayValue.length), 0)
    })
  }



  render () {
    return (
      <div className='center-container'>
        <div id='forgot-form'>
          <div className='title-page'>
            <div className='circle'>
              <i className='icon-envelope' />
            </div>
            <h1>{t("¿OLVIDASTE TU CORREO?")}</h1>
          </div>
          <p className={!this.state.success && !this.state.email ? 'explanation-message' : 'hide'}>
            {t('Ingresá tu nro de documento')}.
          </p>
          <p className={(this.state.success && this.state.email) ? 'success-message' : 'hide'}>
            {t('Tu correo electrónico es: ' + this.state.email)}.
            <p>{t('Si ya no utilizas esa cuenta podes solicitar un cambio ->')}
            <a onClick={this.openPopup} href='#'> aquí.</a>
            </p>
          </p>

          <p className={(this.state.errors && this.state.errors[0].code==='SERVER_ERROR') ? 'error-message' : 'hide'}> 
             {t('El Nro de documento ' + this.state.nro_doc + ' no se encuentra registrado. Si tenés problemas para ingresar contactanos -> ')}
              <a onClick={this.openPopup} href='#'> aquí.</a>
            </p>

            <FormAsync
            action='/api/forgot-email'
            hidden={this.state.success}
            onSuccess={this.onSuccess.bind(this)}
            onFail={this.onFail.bind(this)}
            onSubmit={this.onSubmit.bind(this)}>

            <div className='form-group field-nro-doc'>
              <input
                className='form-control'
                type='text'
                name='nro_doc'
                id='nro_doc'
                maxLength='10'
                onChange={this.handleInputNumberChange}
                value={prettyNumber(this.state.nro_doc)}
                placeholder='Número de documento*'
                required />
            </div>
            <div className='form-group'>
              <button
                className={!this.state.loading ? 'btn btn-primary btn-block' : 'hide'}
                type='submit'
                tabIndex={3}>
                {t('Consultar correo')}
              </button>
              
            </div>
          </FormAsync>
        </div>
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