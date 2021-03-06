import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import t from 't-component'
import ReCAPTCHA from 'react-google-recaptcha'
import config from 'lib/config'
import FormAsync from 'lib/site/form-async'
import PopupCenter from 'ext/lib/open-popup'


export default class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      active: null,
      errors: null,
      name: '',
      lastName: '',
      email: '',
      cod_doc: '',
      sexo: '',
      nro_doc: '',
      pass: '',
      captchaKey: '',
      docValido: false
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.onFail = this.onFail.bind(this)
    this.openPopup = this.openPopup.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.saveName = this.saveName.bind(this)
    this.saveLastName = this.saveLastName.bind(this)
    this.saveEmail = this.saveEmail.bind(this)
    this.saveSex = this.saveSex.bind(this)
    this.saveIdType = this.saveIdType.bind(this)
    this.saveIdNumber = this.saveIdNumber.bind(this)
    this.savePass = this.savePass.bind(this)
    this.checkPassLength = this.checkPassLength.bind(this)
    this.onCaptchaChange = this.onCaptchaChange.bind(this)
    this.onSubmitClick = this.onSubmitClick.bind(this)

  }

  componentWillMount () {
    bus.emit('user-form:load', 'signup')
    this.setState({ active: 'form' })
  }

  componentWillUnmount () {
    bus.emit('user-form:load', '')
  }

  onSubmit () {
    this.setState({ loading: true, errors: null })
  }

  onSuccess (res) {
    this.setState({
      loading: false,
      active: 'congrats',
      errors: null,
      captchaKey: ''
    })
  }


  openPopup = (e) => {
    e.preventDefault()
    let url = 'https://www.rosario.gov.ar/form/id/actualizar-email'
    PopupCenter(url, '', 500, 600)
  }

  onFail (err) {
    console.log(err)
    if (err[0].code === 'DUPLICATED_VOTING_DATA') {
      err[0].message = [`El número de documento ingresado se encuentra utilizado por una cuenta con la dirección de correo ${err[0].docOwner}, en caso que no pueda ingresar con dicha cuenta puede hacer su reclamo haciendo clic`]
   }
    
    this.setState({ loading: false, errors: err, captchaKey: '' })
  }

  saveName (e) {
    this.setState({ name: e.target.value })
  }

  saveLastName (e) {
    this.setState({ lastName: e.target.value })
  }

  saveEmail (e) {
    this.setState({ email: e.target.value })
  }

  saveSex (e) {
    this.setState({ sexo: e.target.value })
    const sex = e.target.value
    if (!sex) {
      document.getElementById("nro_doc").removeAttribute("required")
      document.getElementsByName("extra.cod_doc")[0].removeAttribute("required")

    }else{
    document.getElementById("nro_doc").setAttribute("required",true)
    document.getElementsByName("extra.cod_doc")[0].setAttribute("required",true)
    }
}

  saveIdType (e) {
    this.setState({ cod_doc: e.target.value })
    const tipo = e.target.value
    if (!tipo) {
      document.getElementById("nro_doc").removeAttribute("required")
      document.getElementsByName("extra.sexo")[0].removeAttribute("required")

    }else{
    document.getElementById("nro_doc").setAttribute("required",true)
    document.getElementsByName("extra.sexo")[0].setAttribute("required",true)
    }

  }

  saveIdNumber (e) {
    const input = e.target.value.replace(/[^0-9]/g, '')
    this.setState({ nro_doc: input })
    if (!input) {
      document.getElementsByName("extra.sexo")[0].removeAttribute("required")
      document.getElementsByName("extra.cod_doc")[0].removeAttribute("required")

    }else{
    document.getElementsByName("extra.sexo")[0].setAttribute("required",true)
    document.getElementsByName("extra.cod_doc")[0].setAttribute("required",true)
    }
}

  savePass (e) {
    this.setState({ pass: e.target.value })
  }

  checkPassLength (e) {
    const passLength = e.target.value

    if (passLength.length < 6) {
      e.target.setCustomValidity(t('validators.min-length.plural', { n: 6 }))
    } else {
      if (e.target.name === 're_password' && e.target.value !== this.state.pass) {
        e.target.setCustomValidity(t('common.pass-match-error'))
      } else {
        e.target.setCustomValidity('')
      }
    }
  }

  checkIdNumber (e) {
    if (!e.target.value) return
    const idNumber = parseInt(e.target.value)
    const expr = new RegExp('^[0-9]{7,8}$')
    if (!expr.test(idNumber)) {
      e.target.setCustomValidity('Ingresa un número de documento válido')
      console.log(e.target)
    } else {
      e.target.setCustomValidity('')
      return idNumber
    }
  }

  onCaptchaChange (key) {
    this.setState({ captchaKey: key }, () => {
      this.refs.submitBtn.click()
    })
  }

  avoidScroll () {
    return (e) => {
      e.target.blur()
    }
  }

  onSubmitClick (e) {

    if (config.recaptchaSite && !this.state.captchaKey) {
      this.captcha.execute()
      e.preventDefault()
      return
    }
  }

  render () {
    return (
      <div className='center-container'>
        {
          this.state.active === 'form' &&
          (
            <div id='signup-form'>
              <div className='title-page'>
                <div className='circle'>
                  <i className='icon-user' />
                </div>
                <h1>{t('signup.with-email')}</h1>
              </div>
              <FormAsync
                action='/api/signup'
                onSubmit={this.onSubmit}
                onSuccess={this.onSuccess}
                onFail={this.onFail}>
                {config.recaptchaSite && (
                  <ReCAPTCHA
                    ref={(el) => { this.captcha = el }}
                    size='invisible'
                    sitekey={config.recaptchaSite}
                    onChange={this.onCaptchaChange} />
                )}
                <input
                  type='hidden'
                  name='reference'
                  value={this.props.location.query.ref} />
                <ul
                  className={this.state.errors ? 'form-errors' : 'hide'}>
                  {
                    this.state.errors && this.state.errors
                      .map((error, key) => {
                        console.log(error.code)
                        if (error.code === 'DUPLICATED_VOTING_DATA') {
                          return(
                            <li key={key}>
                              {error.message}
                              <a onClick={this.openPopup} href='#'> aquí.</a>
                            </li>
                          
                          )
                        } else {
                          return(
                              <li key={key}>{error.message || error}</li>
                            )
                        }
                      })
                  }
                </ul>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.email')}</label>
                  <input
                    type='email'
                    className='form-control'
                    name='email'
                    maxLength='200'
                    onChange={this.saveEmail}
                    placeholder={t('forgot.mail.example')}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.your-firstname')}</label>
                  <input
                    type='text'
                    className='form-control'
                    id='firstName'
                    name='firstName'
                    maxLength='100'
                    placeholder={t('signup.firstname')}
                    onChange={this.saveName}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.your-lastname')}</label>
                  <input
                    type='text'
                    className='form-control'
                    id='lastName'
                    name='lastName'
                    maxLength='100'
                    onChange={this.saveLastName}
                    placeholder={t('signup.lastname')}
                    required />
                </div>

                <div className="extras">
                <div className='form-group'>
                  <label htmlFor=''>Sexo</label>
                  <span className='optional-field'>Este campo es opcional.</span>
                  <select
                    className='form-control'
                    defaultValue=''
                    onChange={this.saveSex}
                    name='extra.sexo'>
                    <option value=''disabled >Sexo</option>
                    <option value='F'>Femenino</option>
                    <option value='M'>Masculino</option>
                  </select>
                </div>
                <div className='form-group form-group-documento'>
                  <label htmlFor=''>Tu documento</label>
                  <span className='optional-field'>Este campo es opcional.</span>
                  <select
                    className='form-control'
                    name='extra.cod_doc'
                    onChange={this.saveIdType}
                    defaultValue='' >
                    <option value='' disabled>Tipo</option>
                    <option value='DNI'>DNI</option>
                    <option value='LC'>LC</option>
                    <option value='LE'>LE</option>
                  </select>
                  <input
                    type='number'
                    className='form-control'
                    id='nro_doc'
                    name='extra.nro_doc'
                    maxLength='10'
                    placeholder='Número de documento'
                    onChange={this.saveIdNumber}
                    onWheel={this.avoidScroll()}
                    onBlur={this.checkIdNumber} />
                </div>
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('password')}</label>
                  <input
                    id='signup-pass'
                    className='form-control'
                    name='password'
                    type='password'
                    maxLength='200'
                    onChange={this.savePass}
                    onBlur={this.checkPassLength}
                    placeholder={t('password')}
                    required />
                </div>
               
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.retype-password')}</label>
                  <input
                    type='password'
                    className='form-control'
                    name='re_password'
                    onBlur={this.checkPassLength}
                    required />
                </div>
                <div className='form-group'>
                  <button
                    ref='submitBtn'
                    onClick={this.onSubmitClick}
                    className={!this.state.loading ? 'btn btn-block btn-success btn-lg' : 'hide'}
                    type='submit'>
                    {t('signup.now')}
                  </button>
                  <button
                    className={this.state.loading ? 'loader-btn btn btn-block btn-default btn-lg' : 'hide'}>
                    <div className='loader' />
                    {t('signup.now')}
                  </button>
                </div>
                {
                  (!!config.termsOfService || !!config.privacyPolicy) &&
                  (
                    <div className='form-group accepting'>
                      <p className='help-block text-center'>
                        {t('signup.accepting')}
                      </p>
                      {
                        !!config.termsOfService &&
                        (
                          <Link
                            to='/help/terms-of-service'>
                            {t('help.tos.title')}
                          </Link>
                        )
                      }
                      {
                        !!config.privacyPolicy &&
                        (
                          <Link
                            to='/help/privacy-policy'>
                            {t('help.pp.title')}
                          </Link>
                        )
                      }
                    </div>
                  )
                }
              </FormAsync>
            </div>
          )
        }
        {
          this.state.active === 'congrats' &&
          (
            <div id='signup-message'>
              <h1>{t('signup.welcome', { name: this.state.name + ' ' + this.state.lastName })}</h1>
              <p className='lead'>{t('signup.received')}</p>
              <p className='lead'>{t('signup.check-email')}</p>
              <Link
                to='/signup/resend-validation-email'>
                {t('signup.resend-validation-email')}
              </Link>
            </div>
          )
        }
      </div>
    )
  }
}
