import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'
import moment from 'moment'
import config from 'lib/config'
import user from 'ext/lib/site/user/user'
import userConnector from 'lib/site/connectors/user'
import UserBadge from './user-badge/component'
import CompleteUserData from './complete-data/component'


class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      onMobile: window.innerWidth <= 630,
      showMobileNavigation: false,
      showUserModal: false
    }
  }

  componentWillMount() {
    // listener para que el hash #completar-datos togglee el modal
    window.addEventListener('hashchange', () => {
      if (location.hash === '#completar-datos' && !this.props.user.profileIsComplete()) { 
        this.toggleUserModal()
      }
    }) 
  }

  toggleMobileNavigation = () => {
    this.setState({
      showMobileNavigation: !this.state.showMobileNavigation
    })
  }

  showSub () {
    const pathname = window.location.pathname
    const show = !(
      pathname.includes('auth/google/confirm/authorize') ||
      pathname.includes('auth/facebook/confirm/authorize') ||
      pathname.includes('signin') ||
      pathname.includes('signup') ||
      pathname.includes('admin') ||
      pathname.includes('settings') ||
      pathname.includes('notifications')
    )
    return show
  }

  toggleUserModal = () => {
    this.setState({
      showUserModal: !this.state.showUserModal
    }, () => {
      // limpia el hash al salir del modal
      if (!this.state.showUserModal) {
        history.pushState('', document.title, window.location.pathname)
      }
    })
  }


  render () {
    const showSubMenu = this.showSub()
    return (
      <header className='ext-header'>
      
      {this.state.showUserModal && (
        <CompleteUserData
          toggleUserModal={this.toggleUserModal} />
      )}

        <div className='ext-header-prefix'>
          {/*<a href='http://rosario.gob.ar' rel='noopener noreferrer' target='_blank'>
            <img src='/ext/lib/header/rosarioigual.png' />
          </a>*/}
        </div>
        <div className='ext-header-main'>
          <div className='container-simple'>
            <div className='current-date'>
              {/*<span>{capitalizeFirstLetter(moment().format('dddd D'))}</span>
              <span>{capitalizeFirstLetter(moment().format('MMMM YYYY'))}</span>*/}
              {/*<a href='/' rel='noopener noreferrer' target='_parent'>
                <img src='/ext/lib/header/rosario_participa.svg' />
              </a>*/}
            </div>
            <a href='/' rel='noopener noreferrer' target='_parent'> 
              <div className='logo'>
             
                <img src={config.logo} /> 
                {/*<img src='ext/lib/header/arribabelgrano.svg' />*/} 
              </div>
            </a>  

            { this.props.user.state.fulfilled && (
              <ul className='user-nav nav navbar-nav'>
                <UserBadge />
              </ul>
            )}
            
            {this.props.user.state.rejected && (
              <Link
                to={{
                  pathname: '/signin',
                  query: window.location.pathname !== '/signup',
                  query: window.location.pathname !=='/forgot-email'
                   ? { ref: window.location.pathname }
                   : null
                }}
                className='btn btn-primary btn-sm'>
                Ingresar
              </Link>
            )}
          </div>
        </div>
        {!this.state.onMobile && showSubMenu && (
          <div className='ext-header-sub'>
            <Navigation />
          </div>
        )}
        {this.state.onMobile && showSubMenu && (
          <div
            className='ext-header-sub mobile'
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

const Navigation = withRouter(({ router, onClick }) => (
  <div className='navigation'>
    {Navigation.links.map(({ slug, title }) => (
      <Link
        key={slug}
        className={!~window.location.pathname.indexOf(slug) ? '' : 'active'}
        onClick={onClick}
        to={`/${slug}`}>
        {title}
      </Link>
    ))}
  </div>
))

Navigation.links = [
  // { slug: 'ideas', title: 'Ideas' },
  { slug: 'presupuesto', title: 'Presupuesto Participativo' },
  // { slug: 'consultas', title: 'Consultas' },
  // { slug: 'desafios', title: 'Desafíos' },
  // { slug: 'voluntariado', title: 'Voluntariado Social' }
]

export default userConnector(Header)

function capitalizeFirstLetter (string) {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}
