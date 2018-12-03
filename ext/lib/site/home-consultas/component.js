import React, { Component } from 'react'
import bus from 'bus'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import Footer from '../footer/component'
import Cover from '../cover'
import TopicCard from './topic-card/component'

const filters = {
  new: {
    text: 'Más Nuevas',
    filter: (topic) =>  topic.status === 'open' && !topic.voted,
    emptyMsg: '¡Ya participaste en todas las consultas!'
  },
  all: {
    text: 'Todas',
    filter: () => true,
    emptyMsg: 'No se encontraron consultas.'
  },
  open: {
    text: 'Abiertas',
    filter: (topic) => topic.status === 'open',
    emptyMsg: 'Ya finalizaron todas las consultas, te vamos a avisar cuando se publiquen nuevas.'
  },
  closed: {
    text: 'Finalizadas',
    filter: (topic) => topic.status === 'closed',
    emptyMsg: 'No se encontraron consultas finalizadas.'
  },
  consultas: {
    text: 'Consultas',
    filter: (topic) => topic.attrs.rosario2030 === 'no',
    emptyMsg: 'No se encontraron consultas.'
  },

  rosario2030: {
    text: 'Rosario2030',
    filter: (topic) => topic.attrs.rosario2030 === 'si',
    emptyMsg: 'Actualmente no hay consultas para el 2030.'
  },

}

function filter (key, items = []) {
  return items.filter(filters[key].filter)
}

class HomeConsultas extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      topics: null,
      //filter: 'rosario2030',
      filter: 'consultas'
    }
  }

  componentDidMount = () => {
    forumStore.findOneByName('consultas')
      .then((forum) => Promise.all([
        forum,
        topicStore.findAll({ forum: forum.id })
      ]))
      .then(([forum, [topics, pagination]]) => {
        let filterKey = this.state.filter
        let filtered = filter(filterKey, topics)

        if (filterKey === 'new' && filtered.length === 0) {
          filterKey = 'all'
          filtered = filter(filterKey, topics)
        }

        this.setState({
          forum,
          filter: filterKey,
          topics: filtered,
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
      .then(([topics, pagination]) => {
        this.setState({ topics })
      })
      .catch((err) => { throw err })
  }

  handleFilterChange = (key) => {
    topicStore.findAll({ forum: this.state.forum.id })
      .then(([topics, pagination]) => {
        this.setState({
          filter: key,
          topics: filter(key, topics)
        })
      })
      .catch((err) => { throw err })
  }

  render () {
    const { forum, topics } = this.state

    return (
      <div className='ext-home-consultas'>
        <Cover
          logo='/ext/lib/site/home-multiforum/consultas-icono.png'
          title='Consultas'
          description='Queremos conocer tu opinión sobre diferentes temas. Elegí la mejor opción para la ciudad.' />
        <div className='container'>
          <Filter
            onChange={this.handleFilterChange}
            active={this.state.filter} />
          {topics && topics.length === 0 && (
            <div className='empty-msg'>
              <div className='alert alert-success' role='alert'>
                {filters[this.state.filter].emptyMsg}
              </div>
            </div>
          )}
        </div>
        {topics && topics.length > 0 && (
          <div className='topics-section'>
            <div className='topics-container'>
              {topics.map((topic) => {
                return <TopicCard key={topic.id} forum={forum} topic={topic} />
              })}
            </div>
          </div>
        )}
        {topics && <Footer />}
      </div>
    )
  }
}

const Filter = ({ onChange, active }) => (
  <div className='container'>
    <div className='topics-filter'>
      {Object.keys(filters).map((key) => (
        <button
          key={key}
          className={`btn btn-secondary btn-sm ${key === 'rosario2030' ? 'boton2030' : (key === 'consultas' ? 'boton2030' : 'filtrostatus')}${''} ${active === key ? 'active' : ''}`}
          onClick={() => onChange(key)}>
          {filters[key].text}
        </button>
      ))}
    </div> 
    <div className='pp-nav2'>
          {Object.keys(filters).map((key) => (
           <button
             key={key}
             className={`btn btn-secondary btn-sm ${key === 'rosario2030' ? 'filtro2030' : (key === 'consultas' ? 'filtroconsultas' : 'filtrosocultos')}${''} ${active === key ? 'active' : ''}`}
             onClick={() => onChange(key)}>
             {filters[key].text}
           </button>
          ))}
    </div>
  </div>
)

export default userConnector(HomeConsultas)