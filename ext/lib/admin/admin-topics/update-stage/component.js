import React, { Component } from 'react'
import { render as ReactRender } from 'react-dom'
import { dom as render } from 'lib/render/render'
import 'whatwg-fetch'
import t from 't-component'
import urlBuilder from 'lib/url-builder'
import * as serializer from 'lib/admin/admin-topics-form/body-serializer'
import Datepicker from 'democracyos-datepicker'
import topicStore from 'lib/stores/topic-store/topic-store'
import FormView from 'lib/form-view/form-view'
import o from 'component-dom'

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
      initialCierre:'',
      selectedStage: '',
      savedStage: '',
      disabled: true,
      forum: '',
      cierre: ''
    }
      this.handleClick = this.handleClick.bind(this);
      this.handleChange = this.handleChange.bind(this);

  }

  

  componentWillMount () {
    this.setState ({
      initialStage: this.props.forum.extra.stage,
      initialCierre: new Date(this.props.forum.extra.cierre),

      forum: this.props.forum.id
    })
  }

  //datepicker

  handleChange(e) {
   console.log("hola")
   }
 
 handleClick(e) {
   e.preventDefault()
   this.renderDateTimePickers ()
  }
  


  renderDateTimePickers (e) {
      this.cierre = document.querySelector('[name=closingAt]')
      var valor = Datepicker(this.cierre)
      console.log(valor)
      //this.cierre.value('Datepicker(this.cierre)')
      return this
  }


  chooseStage = (e) => {
    let option = e.target.value
    this.setState({selectedStage: option}, () => {
      if (this.state.selectedStage === this.state.initialStage ) {
        this.setState({disabled: true})
      } else {
        this.setState({disabled: false})
      } 
    })
  }

  changeStage = () => {
    const sendStage = this.state.selectedStage
    fetch('/ext/api/change-stage', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({stage: sendStage, forum: this.state.forum})
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
            <select className='select-stage' onChange={this.chooseStage}>
              {stages.map((stage, i)=> {
                if (stage.name === this.state.initialStage) {
                return <option value={stage.name} key={i} selected>{stage.title}</option>
                } else {
                return <option value={stage.name} key={i}>{stage.title}</option>
                }
              })}
            </select>
          </div>
           <div className="form-group closingAt">
          <label>Fecha de cierre</label>
          <span className="help-text">Fecha de cierre de la votación</span>
          <div className="form-inline">
          <div className="form-group">
          <input name="closingAt" defaultValue={this.state.initialCierre.toLocaleDateString()} placeholder="yyyy/mm/dd" onClick={this.handleClick} onChange={this.handleChange} className="form-control" />
          <input name="closingAtTime" defaultValue={this.state.initialCierre.toLocaleTimeString()} placeholder="hh:mm" className="form-control" />
          </div>
          <button type="button" data-clear-closing-at="data-clear-closing-at" className="btn btn-link remove-button">
          <i className="icon-trash"></i></button>
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