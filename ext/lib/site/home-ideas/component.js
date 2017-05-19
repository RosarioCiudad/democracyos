import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import bus from 'bus'
import t from 't-component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import tagsConnector from 'lib/site/connectors/tags'
import Cover from '../cover'
import Footer from '../footer/component'
import TopicCard from './topic-card/component'

const filters = {
  open: {
    text: 'Abiertas',
    filter: (topic) => topic.open,
    emptyMsg: 'No se encontraron ideas.'
  },
  closed: {
    text: 'Archivadas',
    filter: (topic) => topic.closed,
    emptyMsg: 'No se encontraron ideas.'
  }
}

const sorts = {
  new: {
    text: 'Más Nuevas',
    sort: '-createdAt'
  },
  pop: {
    text: 'Más Populares',
    sort: '-participantsCount'
  }
}

function filter (key, items = []) {
  return items.filter(filters[key].filter)
}

const ListTools = ({ onChangeFilter, onChangeSort, activeSort, activeFilter }) => (
  <div className='topics-filter container'>
    {Object.keys(sorts).map((key) => (
      <button
        key={key}
        className={`btn btn-secondary btn-sm ${activeSort === key ? 'active' : ''}`}
        onClick={() => onChangeSort(key)}>
        {sorts[key].text}
      </button>
    ))}
    {Object.keys(filters).map((key) => (
      <button
        key={key}
        className={`btn btn-secondary btn-sm ${activeFilter === key ? 'active' : ''}`}
        onClick={() => onChangeFilter(key)}>
        {filters[key].text}
      </button>
    ))}
  </div>
)

class HomeIdeas extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      topics: null,
      filter: 'open',
      sort: 'pop'
    }
  }

  componentDidMount = () => {
    console.log(sorts[this.state.sort].sort)
    forumStore.findOneByName('ideas')
      .then((forum) => Promise.all([
        forum,
        topicStore.findAll({ forum: forum.id, sort: sorts[this.state.sort].sort })
      ]))
      .then(([forum, topics]) => {
        console.log(filter(this.state.filter, topics))
        this.setState({
          forum,
          topics: filter(this.state.filter, topics)
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
        this.setState({
          filter: key,
          topics: filter(key, topics)
        })
      })
      .catch((err) => { throw err })
  }

  handleSortChange = (key) => {
    topicStore.findAll({
      forum: this.state.forum.id,
      sort: sorts[key].sort
    }).then((topics) => {
      this.setState({
        filter: key,
        topics: filter(this.state.filter, topics)
      })
    })
    .catch((err) => { throw err })
  }

  handleVote = (id) => {
    const { user } = this.props

    if (user.state.rejected) {
      return browserHistory.push({
        pathname: '/signin',
        query: { ref: window.location.pathname }
      })
    }

    topicStore.support(id).catch((err) => { throw err })
  }

  render () {
    const { forum, topics } = this.state

    return (
      <div className='ext-home-ideas'>
        <Cover
          background='/ext/lib/site/boot/bg-home-forum.jpg'
          logo='/ext/lib/site/home-multiforum/idea-icono.png'
          title='Ideas'
          description='Proponé y apoyá ideas.'>
          <a
            href='/ideas/admin/topics/create'
            className='btn btn-primary crear-idea'>
            {t('proposal-article.create')}
          </a>
        </Cover>
        <ListTools
          activeSort={this.state.sort}
          activeFilter={this.state.filter}
          onChangeSort={this.handleSortChange}
          onChangeFilter={this.handleFilterChange} />
        {topics && topics.length > 0 && (
          <div className='container topics-container'>
            <div className='row'>
              <div className='col-md-4 push-md-8'>
                <TagsList forum={forum} />
              </div>
              <div className='col-md-8 pull-md-4'>
                {topics.map((topic) => (
                  <TopicCard
                    onVote={this.handleVote}
                    key={topic.id}
                    forum={forum}
                    topic={topic} />
                ))}
              </div>
            </div>
          </div>
        )}
        {topics && <Footer />}
      </div>
    )
  }
}

const TagsList = tagsConnector(({ tags }) => {
  if (!tags) return null
  if (tags && tags.length > 50) tags = tags.slice(0, 50)

  return tags && tags.length > 0 && (
    <div className='forum-tags'>
      {tags.map((tag) => (
        <span key={tag} className='badge badge-default'>{tag}</span>
      ))}
    </div>
  )
})

export default userConnector(HomeIdeas)
