/* global fetch */
import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import AddUserInput from 'lib/admin/admin-permissions/add-user-input/add-user-input'
import FormView from 'lib/form-view/form-view'
import request from 'lib/request/request'
import template from './template.jade'
/*import correos from '../../api/invitaciones/correos.json'*/
import usuario from 'lib/user/user'


export default class UserBadgeView extends FormView {
  constructor () {
    super(template)
    this.onSelect = this.onSelect.bind(this)
    this.onSubmitEmail = this.onSubmitEmail.bind(this)
    this.onSubmitBadge = this.onSubmitBadge.bind(this)
/*    this.onSubmitInvitar = this.onSubmitInvitar.bind(this)*/
    
    this.addUserInput = new AddUserInput({
      onSelect: this.onSelect,
      container: this.el[0].querySelector('.user-search')
    })
    
  }

  onSelect (user) {
    window.fetch(`/ext/api/user?id=${user.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.result) {
          this.el[0].querySelector('input[name="email"]').value = res.result.user.email || ''
          if(res.result.user.extra){
            this.el[0].querySelector('input[name="dni"]').value = res.result.user.extra.nro_doc || ''
          }
        }
      })

    this.messages([], 'success')
    this.messages([], 'error')
    this.selectedUser = user
    this.el[0].querySelector('.form-group[name="formulario"]').style.display="block"
    this.el[0].querySelector('.form-group[name="boton"]').style.display="block"
    this.el[0].querySelector('.user-card').style.display = 'flex'
    this.el[0].querySelector('.picture').style.backgroundImage = 'url(' + user.avatar + ')'
    this.el[0].querySelector('.name').textContent = user.fullName
    this.el[0].querySelector('input[name="badge"]').value = user.badge || ''
    return Promise.resolve()
  }

  setBadge (badge) {
    return fetch('/api/settings/badges', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.selectedUser.id,
        badge
      })
    })
  }

  setEmail (email) {
    return fetch('/api/settings/email', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.selectedUser.id,
        email
      })
    })
  }
  
  onSubmitEmail (e) {
    if (!this.selectedUser) return
    var email = this.el[0].querySelector('input[name="email"]').value
  
     this.setEmail(email)
      .then((res) => {
        if (res.ok) {
          this.onsuccessemail(email)
        } else {
          this.onerrorEmail()
        }
      })
      .catch(() => { this.onerrorEmail() })

  }

onSubmitBadge (e) {
    if (!this.selectedUser) return
    var badge = this.el[0].querySelector('input[name="badge"]').value
    if (badge === this.selectedUser.badge) return

    this.setBadge(badge)
      .then((res) => {
        if (res.ok) {
          this.onsuccessbadge()
        } else {
          this.onerrorBadge()
        }
      })
      .catch(() => { this.onerrorBadge() })
  }

  /**
   * Turn on event bindings
   */

  switchOn () {
    /*if(!usuario.load('me').staff){this.el[0].querySelector('.form-group(name="invitar")').style.display="none"}*/
    this.el[0].querySelector('.form-group[name="formulario"]').style.display="none"
    this.el[0].querySelector('.form-group[name="boton"]').style.display="none"
    this.el[0].querySelector('#submit-email').addEventListener('click', this.onSubmitEmail)
    /*this.el[0].querySelector('#submit-invitar').addEventListener('click', this.onSubmitInvitar)*/
    this.on('success', this.onsuccessemail.bind(this))
    this.on('error', this.onerrorEmail.bind(this))
    this.el[0].querySelector('#submit-badge').addEventListener('click', this.onSubmitBadge)
    this.on('success', this.onsuccessbadge.bind(this))
    this.on('error', this.onerrorBadge.bind(this))
  }
  /**
   * Turn off event bindings
   */
  switchOff () {
    this.off()
  }

  /**
   * Handle `error` event with
   * logging and display
   *
   * @param {String} error
   * @api private
   */

   //Api para mandar correos con token
  /*onSubmitInvitar () {
     request
      .post('/api/invitaciones')
      .send()
      .end()
      this.messages(["Se estan generando " +Object.keys(correos).length+ " tokens de ingreso."], 'success')
  }*/

  onsuccessemail (email) {
    var email = {email: email}
    request
    .post('/api/signup/resend-validation-email')
    .send(email)
    .end()
    this.messages(["El correo electrónico ha sido actualizado, se envió un mail al usuario para validar la cuenta."], 'success')
  }

  onsuccessbadge () {
    this.messages(["La etiqueta ha sido actualizada"], 'success')
  }

/*   Handle current password is incorrect*/
   

  onerrorEmail () {
    this.messages([t('common.internal-error')])
  }

  onerrorBadge () {
    this.messages([t('common.internal-error')])
  }
}