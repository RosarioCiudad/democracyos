import React, { Component } from 'react'
import TopicCard from '../topic-card/component'
import Anchor from '../../anchor'

export default class TopicGrid extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedTopics: []
    }
  }

  componentWillReceiveProps (props) {
    const selectedTopics = JSON.parse(sessionStorage.getItem('pp-proyectos')) || []
    if (selectedTopics.length !== this.state.selectedTopics.length) {
      this.setState({ selectedTopics })
    }
  }

  componentDidUpdate (props) {
    const topics = props.districts.reduce((agg, district) => agg.concat(district.topics), [])
    if (topics.length > 0) this.setScroll()
  }

  setScroll () {
    const selectedTopics = JSON.parse(sessionStorage.getItem('pp-proyectos')) || []
    const currentPadron = sessionStorage.getItem('pp-padron')
    if (selectedTopics.length <= 0 && window.innerWidth <= 630) {
      Anchor.goTo('distrito')
      return
    }
    if (selectedTopics.length <= 0) return
    if (currentPadron === 'joven') {
      Anchor.goTo('distrito')
    } else {
      if (selectedTopics[0].attrs.area === '0') {
        Anchor.goTo('barrio')
      } else {
        Anchor.goTo('distrito')
      }
    }
  }

  isSelected = (topic) => {
    if (this.state.selectedTopics) {
      return this.state.selectedTopics.map((p) => p.id).includes(topic.id)
    }
    return false
  }

  isAvailable = (topic) => {
    if (this.state.selectedTopics.length === 0) return true
    if (this.state.selectedTopics[0].attrs.edad === 'joven') return true
    if (this.state.selectedTopics[0].attrs.area === '0') {
      return topic.attrs.area !== '0'
    } else {
      return topic.attrs.area === '0'
    }
  }

  render () {
    if (!this.props.districts && !this.props.districts.length) return null
    let districts = this.props.districts.filter((d) => d.topics.length > 0)
    return (
      <div className='topics-grid'>
        { // Grid Stage Seguimiento
          (this.props.stage === 'seguimiento') && (
          districts.map((district, i) =>
            <div key={i} className='topics-section'>
              <h2 className='topics-section-container topics-section-title'>
                Distrito {district.title}
              </h2>
              <div className='topics-container'>
                {this.props.loading && <div className='loader' />}
                {district.topics.map((topic, i) => <TopicCard key={i} topic={topic} />)}
              </div>
            </div>
            )
          )}
        { // Grid Stage Votacion Abierta Presupuesto Participativo Adulto
          (this.props.stage === 'votacion-abierta' && this.props.age.includes('adulto')) && (
            districts.map((district, i) =>
              // Div Distrito
              <div key={i}>
                {district.topics.filter((topic) => topic.attrs.area === '0').length > 0 &&
                  <div className='topics-section'>
                    <Anchor id='distrito'>
                      <h2 className='topics-section-container topics-section-title'>
                        Selecciona 1 proyecto para tu distrito
                      </h2>
                      <div className='topics-container'>
                        {this.props.loading && <div className='loader' />}
                        {district.topics
                          .filter((topic) => topic.attrs.area === '0')
                          .map((topic, i) =>
                            <TopicCard
                              key={i}
                              topic={topic}
                              isSelected={this.isSelected(topic)}
                              fadeTopic={!this.isAvailable(topic)} />
                          )}
                      </div>
                    </Anchor>
                  </div>
                }
                {district.topics.filter((topic) => topic.attrs.area !== '0').length > 0 &&
                  // Div Area Barrial
                  <div className='topics-section'>
                    <Anchor id='barrio'>
                      <h2 className='topics-section-container topics-section-title topics-section-title-area'>
                        Selecciona 1 proyecto para tu barrio
                      </h2>
                      <div className='topics-container topics-container-area'>
                        {this.props.loading && <div className='loader' />}
                        {district.topics
                          .filter((topic) => topic.attrs.area !== '0')
                          .map((topic, i) =>
                            <TopicCard
                              key={i}
                              topic={topic}
                              isSelected={this.isSelected(topic)}
                              fadeTopic={!this.isAvailable(topic)} />
                          )}
                      </div>
                    </Anchor>
                  </div>
                }
              </div>
            )
          )}
        { // Grid Stage Votacion Abierta Presupuesto Participativo Joven
          (this.props.stage === 'votacion-abierta' && this.props.age.includes('joven')) && (
            districts.map((district, i) =>
              <div key={i} className='topics-section'>
                <Anchor id='distrito'>
                  <h2 className='topics-section-container topics-section-title topics-section-title-joven'>
                    Proyectos para tu distrito
                  </h2>
                  <div className='topics-container'>
                    {this.props.loading && <div className='loader' />}
                    {district.topics
                      .map((topic, i) =>
                        <TopicCard
                          key={i}
                          topic={topic}
                          isSelected={this.isSelected(topic)}
                          fadeTopic={!this.isAvailable(topic)} />
                      )}
                  </div>
                </Anchor>
              </div>
            )
          )}

        { // Grid Stage Votacion Cerrada 
          (this.props.stage === 'votacion-cerrada') && (
            districts.map((district, i) =>
            // Div Distrito
            <div key={i}>
              { district.topics.filter(topic => topic.attrs.area === '0').length > 0 &&
                <div className='topics-section'>
                  <Anchor id='distrito'>
                    <h2 className='topics-section-container topics-section-title'>
                      Proyectos para tu distrito
                    </h2>
                    <div className='topics-container'>
                      {this.props.loading && <div className='loader' />}
                      {district.topics
                        .filter((topic)=>{
                          return topic.attrs.area === '0'
                        })
                        .map((topic, i) => 
                          <TopicCard key={i} topic={topic} stage={this.props.stage} />
                      )}
                    </div>
                  </Anchor>
                </div>
              }
              {district.topics.filter(topic => topic.attrs.area !== '0').length > 0 &&
                //Div Area Barrial
                <div className='topics-section'>
                  <Anchor id='barrio'>
                    <h2 className='topics-section-container topics-section-title topics-section-title-area'>
                      Proyectos para tu barrio
                    </h2>
                    <div className='topics-container topics-container-area'>
                      { 
                        this.props.loading && <div className='loader' />}
                      {district.topics
                        .filter((topic)=>{
                          return topic.attrs.area !== '0'
                        })
                        .map((topic, i) => <TopicCard key={i} topic={topic} stage={this.props.stage} />
                      )}
                    </div>
                  </Anchor>
                </div>
              }
            </div>
          )
        )}

        <div className='grid-bottom'>
          {
            !this.props.noMore && <button className='ver-mas' onClick={this.props.paginateFoward}>Ver más</button>
          }
        </div>
      </div>
    )
  }
}
