import React, { Component } from 'react'
import TopicCard from '../topic-card/component'

export default class TopicGrid extends Component {
  constructor (props) {
    super(props)
    this.state = {
      votacion: false,
      selectedTopics: []
    }
  }

  componentWillMount () {
    let savedTopics = []
    if (localStorage.length > 0) {
      Object.keys(localStorage).forEach((k)=> {
        const topicId = JSON.parse(localStorage.getItem(k)).id
        savedTopics.push(topicId)
      })
      this.setState({
        votacion: true,
        selectedTopics: savedTopics
      })
    }
  }

  fadesTopics = (districtTopics, topic) => {
    let isIncluded = false
    const ids = []
    const savedTopics = this.state.selectedTopics
    Object.values(districtTopics).forEach((v)=> {
      ids.push(v.id)
    })
    savedTopics.forEach((t)=> {
      if (this.state.votacion && ids.includes(t) && topic.id !== t) {
        isIncluded =  true
      }
    })
    return isIncluded
  }

  render () {
    if (!this.props.districts && !this.props.districts.length) return null
    let districts = this.props.districts.filter(d => d.topics.length > 0)
    return (
      <div className='topics-grid'>
        { // Grid Stage Seguimiento
          (this.props.stage === 'seguimiento' || this.props.stage === 'votacion-cerrada') && (
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
          (this.props.stage === 'votacion-abierta' && this.props.age == 'adulto') && (
            districts.map((district, i) =>
            // Div Distrito
            <div key={i}>
              { district.topics.filter(topic => topic.attrs.area === '0').length > 0 &&
                <div className='topics-section'>
                  <h2 className='topics-section-container topics-section-title'>
                    Distrito {district.title}
                  </h2>
                  <div className='topics-container'>
                    {this.props.loading && <div className='loader' />}
                    {district.topics
                      .filter((topic)=>{
                        return topic.attrs.area === '0'
                      })
                      .map((topic, i) => 
                      <TopicCard key={i} topic={topic} />
                    )}
                  </div>
                </div>
              }
              { district.topics.filter(topic => topic.attrs.area !== '0').length > 0 &&
                //Div Area Barrial
                <div className='topics-section'>
                  <h2 className='topics-section-container topics-section-title topics-section-title-area'>
                    Área Barrial
                  </h2>
                  <div className='topics-container topics-container-area'>
                    { 
                      this.props.loading && <div className='loader' />}
                    {district.topics
                      .filter((topic)=> {
                        return topic.attrs.area !== '0'
                      })
                      .map((topic, i) => 
                       <TopicCard key={i} topic={topic} fadeTopic={this.fadesTopics(district.topics, topic)}/>
                    )}
                  </div>
                </div>
              }
            </div>
          )
        )}
        { // Grid Stage Votacion Abierta Presupuesto Participativo Joven
          (this.props.stage === 'votacion-abierta' && this.props.age == 'joven') && (
            districts.map((district, i) =>
            <div key={i} className='topics-section'>
              <h2 className='topics-section-container topics-section-title topics-section-title-joven'>
                Distrito {district.title}
              </h2>
              <div className='topics-container'>
                {this.props.loading && <div className='loader' />}
                {this.props.age == 'joven' && district.topics.map((topic, i) => <TopicCard key={i} topic={topic} />)}
              </div>
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
