import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import tagsConnector from 'lib/site/connectors/tags'
import Cover from '../cover'
import Footer from '../footer/component'
import TopicCard from './topic-card/component'
import CoverIdeas from './cover/component'
import user from 'lib/user/user.js'

const filters = {
 /* new: {
    text: 'Más Nuevas',
    sort: '-createdAt',
    filter: (topic) => topic.status === 'open' && topic.attrs.para === 'belgrano2020',
    emptyMsg: 'No se encontraron ideas.'
  },*/
 /* closed: {
    text: 'Archivadas',
    sort: 'action.count',
    filter: (topic) => topic.status === 'closed',
    emptyMsg: 'No se encontraron ideas.'
  },*/

/*  ideas: {
    text: 'Ideas',
    sort: '-createdAt',
    filter: (topic) => topic.attrs.rosario2030 === 'no',
    emptyMsg: 'No se encontraron ideas.'
  },*/
  para: {
    text: 'Más nuevas',
    sort: '-createdAt',
    filter: (topic) => topic.status === 'open' && topic.attrs.para === 'belgrano2020',
    emptyMsg: 'Actualmente no hay ideas para esta consigna.'
  },
 pop: {
    text: 'Más Populares',
    sort: '-action.count',
    filter: (topic) => topic.status === 'open' && topic.attrs.para === 'belgrano2020',
    emptyMsg: 'No se encontraron ideas.'
  },
}
function filter (key, items = []) {
  return items.filter(filters[key].filter)
}

const ListTools = ({ onChangeFilter, activeFilter }) => (
  <div className='container'>
    <div className='row'>
      <div className='col-md-8 list-tools'>
        <div className='topics-filter'>
          {Object.keys(filters).map((key) => (
            <button
              key={key}
              className={`btn btn-secondary btn-sm ${key === 'rosario2030' ? 'boton2030' : (key === 'ideas' ? 'boton2030' : 'filtrostatus')}${''} ${activeFilter === key ? 'active' : ''}`}
              onClick={() => onChangeFilter(key)}>
              {filters[key].text}
            </button>
          ))}
        </div>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-12'>    
        {/*<div className='pp-nav2'>
          {Object.keys(filters).map((key) => (
           <button
             key={key}
             className={`btn btn-secondary btn-sm ${key === 'rosario2030' ? 'filtro2030' : (key === 'ideas' ? 'filtroideas' : 'filtrosocultos')}${''} ${activeFilter === key ? 'active' : ''}`}
             onClick={() => onChangeFilter(key)}>
             {filters[key].text}
           </button>
          ))}
        </div>*/}
      </div>   
    </div>
    <div className='row'>
      <div className='col-md-8 escribir'> 
        <a
          href={user.load('me').id ? 'ideas/admin/topics/create' : 'signin?ref=%2Fideas/admin/topics/create' }
          className='btn btn-lg btn-primary crear-idea'>
          Escribí tu idea
        </a>
      </div>
    </div>
  </div>
)

class HomeIdeas extends Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 1,
      noMore: false,
      forum: null,
      topics: null,
      tags: null,
      filter: 'para',
    }
  }

  componentDidMount = () => {

    forumStore.findOneByName('ideas')
      .then((forum) => {
        const tags = window.fetch(`/api/v2/forums/${forum.id}/tags`).then((res) => res.json())
        return Promise.all([
          forum,
          this.fetchTopics(this.state.page, forum.id),
          tags
        ])
      })
      .then(([forum, topics, tags]) => {
        this.setState({
          forum,
          topics: filter(this.state.filter, topics),
          tags: tags.results.tags.filter(tag => tag.count > 1).map(tag => tag.tag)
        })
        this.fetchTopics(this.state.page + 1, forum.id).then((topics) =>{
          var topicsPageSiguiente = filter(this.state.filter, topics)
          if (topicsPageSiguiente.length > 0){
            this.setState({
              noMore: true
            })
          }
        })
      })
      .catch((err) => { throw err })

  }


  fetchTopics = (page, forumId) => {
    var u = new window.URLSearchParams(window.location.search)
    let query = {}
    query.forum = forumId
    query.page = page
    query.limit = filters[this.state.filter].sort === '-action.count' ? 500 : 16
    query.sort = filters[this.state.filter].sort
    if (u.has('tag')) query.tag = u.get('tag')
    return topicStore.findAll(query).then(([topics, pagination]) => topics)
  }

      
  paginateForward = () => {
    let filtro= this.state.filter
    let page = this.state.page
    page++
    this.fetchTopics(page, this.state.forum.id)
    .then((topics) => {
      this.setState({
        topics: this.state.topics.concat(filter(filtro, topics)),
        /*noMore: topics.length > 5,*/
        page
      })
    this.fetchTopics(page, this.state.forum.id).then((topics) =>{
        var topicsPageSiguiente = filter(filtro, topics)
        console.log(topicsPageSiguiente)
        this.setState({
            noMore: topicsPageSiguiente.length > 0
        })
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleFilterChange = (key) => {
    let query = {}
    var u = new window.URLSearchParams(window.location.search)
    if (u.has('tag')) query.tag = u.get('tag')
    query.forum = this.state.forum.id
    query.sort = filters[key].sort

    this.setState({ filter: key }, () => {
      this.fetchTopics(1, this.state.forum.id)
        .then((topics) => {
          console.log(topics)
          this.setState({
            topics: filter(this.state.filter, topics),
            noMore: this.state.filter==='para',
            page: 1
          })
        })
    })
  }

  handleVote = (id) => {
    const { user } = this.props

    if (user.state.rejected) {
      return browserHistory.push({
        pathname: '/signin',
        query: { ref: window.location.pathname }
      })
    }

    topicStore.vote(id, 'apoyo-idea').then((res) => {
      let topics = this.state.topics
      let index = topics.findIndex((t) => t.id === id)
      topics[index] = res
      this.setState({ topics })
    }).catch((err) => { throw err })
  }

  render () {
    const { forum, topics, tags } = this.state
    return (
      <div className='ext-home-ideas'>
        {/*<Cover
          logo='/ext/lib/site/home-multiforum/ideas_belgrano.svg'
          title='Ideas'
          description='¿Tenés ideas para mejorar la vida en la ciudad? Compartilas.' />*/}
        <CoverIdeas/>
        <ListTools
          activeFilter={this.state.filter}
          onChangeFilter={this.handleFilterChange} />
        <div className='container topics-container'>
          <div className='row'>
            <div className='col-md-4 push-md-8 etiquetas'>
              <div className='invita-consulta'>
                <span>
                  Votá por una imagen de Belgrano para el Pasaje Juramento
                </span>
                <a href='/consultas' rel='noopener noreferrer' target='_parent'>
                  <img src='/ext/lib/site/home-multiforum/consultas.svg' className="invita-consulta"/>
                </a>
              </div>
              {/*<h3>Distritos</h3>
              {forum && <TagsList tags={forum.initialTags} forumName={forum.name} />}
              <h3>Temas</h3>
              {forum && <TagsList tags={tags} forumName={forum.name} without={forum.initialTags} />}*/}
            </div>
            <div className='col-md-8 pull-md-4'>

              {topics && topics.length === 0 && (
                <div className='empty-msg'>
                  <div className='alert alert-success' role='alert'>
                    {filters[this.state.filter].emptyMsg}
                  </div>
                </div>
              )}
              {topics && topics.map((topic) => (
                <TopicCard
                  onVote={this.handleVote}
                  key={topic.id}
                  forum={forum}
                  topic={topic} />
              ))}
              {
                this.state.noMore &&
                  (
                  <div className='more-topics'>
                    <button onClick={this.paginateForward}>Ver Más</button>
                  </div>
                  )
              }
            </div>
          </div>
        </div>
        {topics && <Footer />}
      </div>
    )
  }
}

const TagsList = tagsConnector(({ tags, forumName, without }) => {
  var u = new window.URLSearchParams(window.location.search)
  if (without) tags = tags.filter((t) => !~without.indexOf(t))
  return tags && tags.length > 0 && (
    <div className='forum-tags'>
      {tags.map((tag, i) => {
        let active, url
        if (u.has('tag') && u.get('tag') === tag) {
          active = 'active'
          url = `${window.location.origin}/${forumName}`
        } else {
          active = ''
          url = `${window.location.origin}/${forumName}?tag=${tag}`
        }
        return <a
          className={`badge badge-default ${active}`}
          href={`${url}`}
          key={i}>
          {tag}
        </a>
      })}
    </div>
  )
})

export default userConnector(HomeIdeas)
