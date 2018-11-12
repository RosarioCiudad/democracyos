import React, { Component } from 'react'
import { Link } from 'react-router'
import user from 'lib/site/user/user'

export default class SignupComplete extends Component {
  constructor (props) {
    super(props)

    const attrs = user.state.value || {}
    const extra = attrs.extra || {}

    this.state = {
      error: '',
      loading: false,
      cod_doc_disabled: !!extra.cod_doc,
      sexo_disabled: !!extra.sexo,
      nro_doc_disabled: !!extra.nro_doc,
      data: {
        cod_doc: extra.cod_doc || '',
        sexo: extra.sexo || '',
        nro_doc: extra.nro_doc || ''
      }
    }
  }

  handleForm = (evt) => {
    evt.preventDefault()

    this.setState({
      error: '',
      loading: true,
    })

    user.saveExtraData(
        {
          cod_doc: this.state.data.cod_doc,
          nro_doc: this.state.data.nro_doc.replace(/[^0-9]/g, ''),
          sexo: this.state.data.sexo
        }
      ).then({
      this.setState({
        error: '',
        loading: false
      })

      user.update(Object.assign({}, user.state.value, {
        extra: this.state.data
      }))
      

      this.props.toggleUserModal()

      // browserHistory.push('/')
    }).catch((err) => {
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

  handleInputChange = (evt) => {
    const input = evt.target
    const name = input.getAttribute('name')

    const data = Object.assign({}, this.state.data, {
      [name]: input.value
    })

    this.setState({ data })
  }

  handleInputNumberChange = (evt) => {
    const input = evt.target
    const value = input.value.replace(/[^0-9]/g, '')
    const data = Object.assign({}, this.state.data, { nro_doc: value })
    this.setState({ data }, () => {
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
            <p>Para poder votar es necesario completar estos datos. En caso de no querer hacerlo ahora, podés hacerlo en cualquier momento desde tu perfil de usuario.</p>
          </div>
          <div className='form-fields'>
            {this.state.error && (
              <div className='alert alert-danger error' role='alert'>
                <span dangerouslySetInnerHTML={{
                  __html: this.state.error
                }} />
              </div>
            )}
            <div className='form-group field-sexo'>
              <div className='form-select-wrapper'>
                <i />
                <select
                  className='form-control custom-select field-sexo'
                  name='sexo'
                  id='sexo'
                  value={this.state.data.sexo}
                  onChange={this.handleInputChange}
                  disabled={this.state.loading || this.state.sexo_disabled}
                  required>
                  <option className='opcion' value='' disabled>¿Cuál es tu sexo?*</option>
                  <option className='opcion' value='F'>Femenino</option>
                  <option className='opcion' value='M'>Masculino</option>
                </select>
              </div>
            </div>
            <div className='form-group field-cod-doc'>
              <div className='form-select-wrapper'>
                <i />
                <select
                  className='form-control custom-select'
                  name='cod_doc'
                  id='cod_doc'
                  value={this.state.data.cod_doc}
                  onChange={this.handleInputChange}
                  disabled={this.state.loading || this.state.cod_doc_disabled}
                  required>
                  <option value='' disabled>Tipo*</option>
                  <option value='DNI'>DNI</option>
                  <option value='LC'>LC</option>
                  <option value='LE'>LE</option>
                </select>
              </div>
            </div>
            <div className='form-group field-nro-doc'>
              <input
                className='form-control custom-select'
                type='text'
                name='nro_doc'
                id='nro_doc'
                maxLength='10'
                onChange={this.handleInputNumberChange}
                value={this.state.data.nro_doc}
                disabled={this.state.loading || this.state.nro_doc_disabled}
                placeholder='Número de documento*'
                required />
            </div>
          </div>

          <div className='form-actions'>
            {!user.profileIsComplete() && (
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
