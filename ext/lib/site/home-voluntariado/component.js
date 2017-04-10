import React, { Component } from 'react'
import bus from 'bus'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import TopicCard from './topic-card/component'

class HomeVoluntariados extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      topics: null
    }
  }

  componentDidMount = () => {
    forumStore.findOneByName('voluntariado')
      .then((forum) => Promise.all([
        forum,
        topicStore.findAll({ forum: forum.id })
      ]))
      .then(([forum, topics]) => {
        this.setState({
          forum,
          topics
        })

        bus.on('topic-store:update:all', this.fetchTopics)
      })
      .catch((err) => { throw err })
  }

  componentWillUnmount = () => {
    bus.off('topic-store:update:all', this.fetchTopics)
  }

  fetchTopics = () => {
    topicStore.findAll({ forum: this.state.forum.id })
      .then((topics) => {
        this.setState({ topics })
      })
      .catch((err) => { throw err })
  }

  handleFilterChange = (key) => {
    topicStore.findAll({ forum: this.state.forum.id })
      .then((topics) => {
        this.setState({ topics })
      })
      .catch((err) => { throw err })
  }

  render () {
    const { forum, topics } = this.state

    return (
      <div className='ext-home-voluntariados'>
        <div className='cover'>
          <div className='container'>
            <div className='isologo voluntariados' />
            <h1>Voluntariado social</h1>
            <p>Las organizaciones sociales son parte central de la vida en nuestra ciudad.</p>
            <p className='sub-sub-title'>Conocelas y sumate como voluntario o <a href="#">Sumá tu ONG</a>.</p>
          </div>
        </div>
        <h2 className='filter'>
          Ver las organizacion en
          <select>
            <option selected>todos los distritos</option>
          </select>
          que trabajen sobre
          <select>
            <option selected>todos los temas</option>
          </select>
        </h2>
        {topics && topics.length > 0 && (
          <div className='topics-section'>
            <div className='topics-container'>
              {topics.map((topic) => {
                return <TopicCard key={topic.id} forum={forum} topic={topic} />
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default userConnector(HomeVoluntariados)
