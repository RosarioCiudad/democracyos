import React, { Component } from 'react'
import * as HomeForum from 'lib/site/home-forum/component'
import HomePresupuesto from 'ext/lib/site/home-presupuesto/component'
import HomeConsultas from 'ext/lib/site/home-consultas/component'
import HomeDesafios from 'ext/lib/site/home-desafios/component'
import HomeVoluntariado from 'ext/lib/site/home-voluntariado/component'

const HomeForumOriginal = HomeForum.default

export default class HomeForumOverride extends Component {
  render () {
    const name = this.props.params.forum

    switch (name) {
      case 'presupuesto':
        return <HomePresupuesto {...this.props} />
      case 'consultas':
        return <HomeConsultas {...this.props} />
      case 'desafios':
        return <HomeDesafios {...this.props} />
      case 'voluntariado':
        return <HomeVoluntariado {...this.props} />
      default:
        return <HomeForumOriginal {...this.props} />
    }
  }
}
