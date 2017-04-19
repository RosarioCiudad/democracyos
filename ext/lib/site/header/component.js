import React, { Component } from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import config from 'lib/config'
import userConnector from 'lib/site/connectors/user'
import UserBadge from 'lib/site/header/user-badge/component'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userForm: null,
      showToggleSidebar: null,
      showSidebar: null
    }
  }

  render () {
    return (
      <header className='navbar ext-site-header'>
        <div className='ext-site-header-prefix'>
          <a href='http://rosario.gob.ar' rel='noopener noreferrer'>
            <img src='/ext/lib/site/header/rosarioigual.png' />
          </a>
        </div>
        <div className='ext-site-header-main'>
          <div className='container-simple'>
            <div className='current-date'>
              <span>{capitalizeFirstLetter(moment().format('dddd D'))}</span>
              <span>{capitalizeFirstLetter(moment().format('MMMM YYYY'))}</span>
            </div>

            <h1 className='logo'>
              <Link to={config.homeLink}>
                <img src={config.logo} />
              </Link>
            </h1>

            <ul className='user-nav nav navbar-nav float-xs-right'>
              {this.props.user.state.fulfilled && (
                <UserBadge />
              )}

              {this.props.user.state.rejected && (
                <Link to='/signin' className='login-rosario'>Participá</Link>
              )}
            </ul>
          </div>
        </div>
        <div className='ext-site-header-sub'>
          <input type='checkbox' id='sub-menu-toggle' />
          <label
            htmlFor='sub-menu-toggle'
            className='toggle-submenu-btn'>
            <span className='bar-icon' />
            <span className='bar-icon' />
            <span className='bar-icon' />
          </label>
          <Link to='/consultas'>Consultas</Link>
          <Link to='/desafios'>Desafíos</Link>
          <Link to='/presupuesto'>Presupuesta participativo</Link>
          <Link to='/voluntariado'>Voluntariado</Link>
        </div>
      </header>
    )
  }
}

export default userConnector(Header)

function capitalizeFirstLetter (string) {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}
