import React, { Component } from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import config from 'lib/config'
import userConnector from 'lib/site/connectors/user'
import UserBadge from 'lib/header/user-badge/component'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      onMobile: window.innerWidth <= 630,
      showMobileNavigation: false
    }
  }

  toggleMobileNavigation = () => {
    this.setState({
      showMobileNavigation: !this.state.showMobileNavigation
    })
  }

  render () {
    return (
      <header className='ext-site-header'>
        <div className='ext-site-header-prefix'>
          <a href='http://rosario.gob.ar' rel='noopener noreferrer'>
            <img src='/ext/lib/header/rosarioigual.png' />
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

            {this.props.user.state.fulfilled && (
              <ul className='user-nav nav navbar-nav'>
                <UserBadge />
              </ul>
            )}

            {this.props.user.state.rejected && (
              <Link to='/signin' className='btn btn-primary btn-sm'>
                Participá
              </Link>
            )}
          </div>
        </div>
        {!this.state.onMobile && (
          <div className='ext-site-header-sub'>
            <Navigation />
          </div>
        )}
        {this.state.onMobile && (
          <div
            className='ext-site-header-sub mobile'
            onClick={this.toggleMobileNavigation}>
            <button
              className='toggle-submenu-btn'
              type='button'>
              <div className='bar-icon' />
              <div className='bar-icon' />
              <div className='bar-icon' />
            </button>
            {this.state.showMobileNavigation && (
              <Navigation onClick={this.toggleMobileNavigation} />
            )}
          </div>
        )}
      </header>
    )
  }
}

const Navigation = ({ onClick }) => (
  <div className='navigation'>
    <Link onClick={onClick} to='/consultas'>Consultas</Link>
    <Link onClick={onClick} to='/desafios'>Desafíos</Link>
    <Link onClick={onClick} to='/presupuesto'>Presupuesto participativo</Link>
    <Link onClick={onClick} to='/voluntariado'>Voluntariado Social</Link>
  </div>
)

export default userConnector(Header)

function capitalizeFirstLetter (string) {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}
