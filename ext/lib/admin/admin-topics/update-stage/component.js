import React, { Component } from 'react'
import { render as ReactRender } from 'react-dom'
import { dom as render } from 'lib/render/render'
import 'whatwg-fetch'
import t from 't-component'
import urlBuilder from 'lib/url-builder'
import * as serializer from 'lib/admin/admin-topics-form/body-serializer'
import moment from 'moment'
import 'moment-timezone'
import topicStore from 'lib/stores/topic-store/topic-store'
import FormView from 'lib/form-view/form-view'
import o from 'component-dom'
import DatePicker from 'react-datepicker'

const stages = [
  {'name': 'votacion-abierta', 'title': 'Votación abierta'},
  {'name': 'votacion-cerrada', 'title': 'Resultados de votación'},
  {'name': 'seguimiento', 'title': 'Seguimiento' }
]

export default class UpdateStage extends Component {
  constructor (props) {
    super (props)
    this.state = {
      visibility: false,
      success: false,
      initialStage: '',
      selectedStage: '',
      savedStage: '',
      disabled: true,
      forum: '',
      startDate: moment(),
      open: false
    }

      this.handleChange = this.handleChange.bind(this)

  }



  componentWillMount () {
       this.setState ({
      initialStage: this.props.forum.extra.stage,
     //Inicializo la fecha y hora del calendario con la fecha de cierre guardada en la base y le sumo 3 horas por el formato GTM -3
      startDate: moment(this.props.forum.extra.cierre).add(3, 'hours'),

      forum: this.props.forum.id,
    })
  }




handleChange(date) {
    this.setState({
      startDate: date,
      disabled: false,
      selectedStage: this.state.initialStage
    })
    }

  chooseStage = (e) => {
    let option = e.target.value
    this.setState({selectedStage: option}, () => {
      if (this.state.selectedStage === this.state.initialStage) {
        this.setState({disabled: true})
      } else {
        this.setState({disabled: false})
      }
    })
  }

  changeStage = (e) => {
    e.preventDefault()
    const cierre = this.state.startDate ? this.state.startDate.format('YYYY-MM-DDTHH:mm:ss') : null
    const sendStage = this.state.selectedStage
    fetch('/ext/api/change-stage', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({stage: sendStage, cierre: cierre, forum: this.state.forum})
    })
    .then((res) => {
      if (res.status === 200) {
        this.setState({
          initialStage: sendStage,
          visibility: true,
          disabled: true,
          success: true
        })
      } else {
        if (res.status == 400) {
          this.setState({
            visibility: true,
            success: false
          })
        }
      }
      setTimeout(() => this.setState({
        visibility: false,
        success: false
        }), 5000)
    })
  }

  render () {
    return (
      <div>
        {this.state.visibility &&
          <div className={this.state.success ? 'success-message' : 'error-message'}>
            <p>{ this.state.success ?'Cambio realizado exitosamente.': 'El cambio no pudo ser realizado.'}</p>
          </div>
        }
        <div className='wrapper-select'>
          <div>
            <label className='stage-label'>
              Cambiar fase de Presupuesto Participativo
            </label>
            <select className='select-stage' defaultValue={this.state.initialStage} onChange={this.chooseStage}>
              {stages.map((stage, i)=> {
                return <option value={stage.name} key={i}>{stage.title}</option>
              })}
            </select>
          </div>
           <div className={`"form-group" ${this.state.selectedStage=="votacion-abierta" || (!this.state.selectedStage && this.state.initialStage=="votacion-abierta") ? '' : 'cierreoculto'}`}>
          <label>Fecha de cierre</label>
          <span className="help-text">Fecha de cierre de la votación</span>
          <div className="form-inline">
          <div className="form-group formcierre">
          <DatePicker dateFormat="YYYY/MM/DD" selected={this.state.startDate < moment() ? null : this.state.startDate} onChange={this.handleChange} onChange={this.handleChange} calendarClassName="fuente" isClearable={true}
  placeholderText="Fecha" className="form-control datecierre"/>
        
          <DatePicker selected={this.state.startDate < moment() ? null : this.state.startDate} onChange={this.handleChange} showTimeSelect showTimeSelectOnly timeCaption="Time" dateFormat="LT" calendarClassName="fuente" className="form-control" placeholderText="Hora"/>
          </div>
          </div>
          </div>

          <button className='btn btn-primary boton' onClick={this.changeStage} disabled={this.state.disabled}>
            Confirmar
          </button>
        </div>
      </div>
      )
  }



}