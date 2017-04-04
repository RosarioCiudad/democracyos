import React, { Component } from 'react'
import * as HomeForum from 'lib/site/home-forum/component'
import HomePresupuesto from 'ext/lib/site/home-presupuesto/component'
import HomeConsultas from 'ext/lib/site/home-consultas/component'

const HomeForumOriginal = HomeForum.default

export default class HomeForumOverride extends Component {
  render () {
    const name = this.props.params.forum

    if (name === 'presupuesto') {
      return <HomePresupuesto {...this.props} />
    }

    if (name === 'consultas') {
      return <HomeConsultas {...this.props} />
    }

    return <HomeForumOriginal {...this.props} />
  }
}
