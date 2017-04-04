import React, { Component } from 'react'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
// import TopicCard from './topic-card/component'

class HomeConsultas extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      forum: null,
      topics: null
    }
  }

  componentDidMount = () => {
    forumStore.findOneByName('consultas')
      .then((forum) => Promise.all([
        forum,
        topicStore.findAll({ forum: forum.id })
      ]))
      .then(([forum, topics]) => {
        this.setState({
          loading: false,
          forum,
          topics
        })
      })
      .catch((err) => {
        this.setState({ loading: false })
        throw err
      })
  }

  render () {
    const { forum, topics } = this.state

    return (
      <div className='ext-home-consultas'>
        <div className='cover'>
          <div className='container'>
            <div className='isologo consultas'></div>
            <h1>Consultas</h1>
            <p>La Municipalidad quiere conocer tu opinión sobre<br />diferentes temáticas de nuestra Ciudad.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default userConnector(HomeConsultas)
