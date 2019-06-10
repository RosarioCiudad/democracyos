import React, { Component } from 'react'
import t from 't-component'
import { Link } from 'react-router'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import ChangeVote from 'lib/site/topic-layout/topic-article/change-vote-button/component'
import CantComment from 'lib/site/topic-layout/topic-article/cant-comment/component'
import Required from 'lib/site/topic-layout/topic-article/required/component'

export class Poll extends Component {
  static getResults (topic, userVote) {

    const results = topic.action.results

    const winnerCount = Math.max(...results.map((opt) => opt.percentage))
    return results.map((opt) => Object.assign({
      winner: winnerCount === opt.percentage,
      voted: opt.value === userVote
    }, opt))
  }

  constructor (props) {
    super(props)
    this.state = {
      changingVote: false,
      selected: null,
      results: null,
      mostrarCambiar:false,
      mostrarVotar:false
    }
    
  }


  handlePoll = (e) => {

    if (!this.state.changingVote) {
      if (!this.props.user.state.fulfilled) return
      if (this.state.showResults) return
    }

    if (!this.state.selected) return

    topicStore.vote(this.props.topic.id, this.state.selected)
      .then(() => {
        topicStore.findOne(this.props.topic.id).then((newTopic) => {
          console.log(newTopic)

          this.setState((prevState) => ({
            changingVote: false,
            mostrarCambiar: true,
            mostrarVotar: false,
            results: Poll.getResults(newTopic, this.state.selected),
            selected: this.state.selected
          }))
        })
       
      })
      
      .catch((err) => { throw err })

  }

  select = (option) => (e) => {
    if (this.state.changingVote || this.props.topic.voted === false) {
      this.setState({ selected: option })
    }
  }

  componentWillMount () {
    this.setStateFromProps(this.props)
  }

  componentWillReceiveProps (props) {
    console.log("recibo props")
    this.setStateFromProps(props)
  }

  setStateFromProps (props) {
    const { topic } = props

    return this.setState({
      results: Poll.getResults(topic, topic.voted),
      selected: topic.voted
    })
    
  }



  changeVote = () => {
    this.setState({
      changingVote: true,
      mostrarVotar: true,
    })
  }

  render () {
    if (this.props.user.state.pending) return null

    const { user, topic } = this.props
    const { results, changingVote, selected, mostrarCambiar, mostrarVotar} = this.state

    if (!results) return null

    const showResults = (topic.closed || topic.voted) && !mostrarVotar
    const showVoteBox = (!(topic.closed && !!selected) || changingVote) && !showResults

    const showChangeVote = (!topic.closed && !changingVote && !!topic.voted) || (mostrarCambiar && !mostrarVotar)
    const showVoteButton = (!topic.closed && !showChangeVote) || (mostrarVotar && !mostrarCambiar)
    const cantComment = user.state.fulfilled && !topic.privileges.canVote
    const isRequired = !user.state.fulfilled && !showResults

    return (
      <div className='topics-poll'>
        <div className='poll-options'>
          {
            showResults && results.map((result, i) => (
              <ResultBox
                key={i}
                selected={selected === result.value}
                value={result.value}
                percentage={result.percentage}
                winner={result.winner} />
            ))
          }
          {
            (showVoteBox && !showResults) && results.map((result, i) => (
              <Option
                key={i}
                onSelect={this.select(result.value)}
                value={result.value}
                percentage={result.percentage}
                winner={result.winner}
                selected={selected === result.value}
                votada={mostrarCambiar}/>
            ))
          }
          { showChangeVote && <ChangeVote handleClick={this.changeVote} /> }
          { showChangeVote && <Mensaje />}

          {
            showVoteButton && <button
              className='btn btn-primary'
              onClick={this.handlePoll}
              disabled={!this.state.selected || !user.state.fulfilled}>
              {t('topics.actions.poll.do')}
            </button>
          }
        </div>
        {
          isRequired && (
            <Required />
          )
        }
        {
          cantComment && (
            <CantComment />
          )
        }
      </div>
    )
  }
}

export default userConnector(Poll)

const Option = ({ winner, onSelect, selected, percentage, value, votada }) => (
  <button
    className={'btn btn-default poll-btn not-show-results'  +
      (winner && votada ? ' winner' : '')}
    onClick={onSelect}>
    {selected && <span className='circle icon-check' />}
    {votada && <span className='poll-results'>{ percentage }%</span>}
      <span className='poll-option-label'>{ value }</span>
     {votada && <div className='results-bar' style={{ width: `${percentage}%` }} />}
    {!selected && <span className='circle' />}
  </button>
)

const ResultBox = ({ winner, selected, percentage, value }) => {
  return (
    <button className={
      'btn btn-default poll-btn show-results' +
      (winner ? ' winner' : '')
    }>
      {selected && <span className='circle icon-check' />}
      <span className='poll-results'>{ percentage }%</span>
      <span className='poll-option-label'>{ value }</span>
      <div className='results-bar' style={{ width: `${percentage}%` }} />
    </button>
  )
}

const Mensaje = () => {
  return(
    <span className='vote-mensaje'>¡Gracias por tu voto!</span>
    )
}