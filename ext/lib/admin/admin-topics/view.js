/**
 * Module dependencies.
 */
//import React from 'react'
import React, { Component } from 'react'
import { render as ReactRender } from 'react-dom'
import debug from 'debug'
import t from 't-component'
import List from 'democracyos-list.js'
import moment from 'moment'
import confirm from 'democracyos-confirmation'
import ReactPaginate from 'react-paginate'
import urlBuilder from 'lib/url-builder'
import View from 'lib/view/view'
import topicStore from 'lib/stores/topic-store/topic-store'
import { getQueryVariable } from 'lib/utils'
import template from './template.jade'
import UpdateStage from './update-stage/component'
import ExportUpdate from './export-update/component'


const log = debug('democracyos:admin-topics')

//defino los valores de los filtros
const anios = [
  {'name': 'todos', 'title': 'Todos'},
  {'name': '2017', 'title': '2017'},
  {'name': '2018', 'title': '2018'},
  {'name': '2019', 'title': '2019' }
]

const modalidades =  [
  {'name': 'todos', 'title': 'Todos'},
  {'name': 'adulto', 'title': 'adulto'},
  {'name': 'joven', 'title': 'joven'},
]

const distritos =  [
  {'name': 'todos', 'title': 'Todos'},
  {'name': 'centro', 'title': 'Centro'},
  {'name': 'noroeste', 'title': 'Noroeste'},
  {'name': 'norte', 'title': 'Norte'},
  {'name': 'oeste', 'title': 'Oeste'},
  {'name': 'sudoeste', 'title': 'sudoeste'},
  {'name': 'Sur', 'title': 'Sur'},

]

/**
 * Creates a list view of topics
 */

export default class TopicsListView extends View {
  constructor (topics, forum = null, pagination) {
    super(template, {
      topics: topics.filter((t) => t.privileges.canEdit || t.privileges.canDelete),
      moment,
      forum,
      urlBuilder,
    })
    this.forum = forum
    //bind evento para filtrar
    //this.chooseAnio = this.chooseAnio.bind(this)

  }


  //Evento para filtrar
  //chooseAnio(event) {
    //Obtengo los valores de cada select para mantener los filtros
    //var aniohtml = document.getElementById('anio')
    //var anio = aniohtml.options[aniohtml.selectedIndex].text
    //var modalidadhtml = document.getElementById('modalidad')
    //var modalidad = modalidadhtml.options[modalidadhtml.selectedIndex].text
    //var distritohtml = document.getElementById('distrito')
    //var distritotitle = distritohtml.options[distritohtml.selectedIndex].text
   //Adapto el filtro distrito al valor que tiene la lista
    //var distrito = "Distrito ".concat(distritotitle.toLowerCase())
    ////Defino valor vacio para filtrar con la opcion "Todos"
     // if (anio === "Todos"){ anio=""}
     // if (distrito === "Distrito todos"){ distrito=""}
     // if (modalidad === "Todos"){ modalidad=""}
       
    //Filtro la lista
     // var lista =  this.list.filter(function(item) {
     //return item.values().topicanio.includes(anio) && item.values().topicedad.includes(modalidad)  && item.values().topicdistrito.includes(distrito)
    //this.lista.sort("topicanio", {order: 'desc'})
    //})
    //this.list.sort("topicnro", {order: 'asc'})
    
  //}


  switchOn () {
    this.bind('click', '.btn.delete-topic', this.bound('ondeletetopicclick'))
    this.list = new List('topics-wrapper', { valueNames: ['topic-title', 'topicid', 'topic-date', 'topicanio', 'topicdistrito','topicedad'] })


   if (this.forum.name === 'presupuesto' && this.forum.privileges.canEdit){
    this.list = new List('topics-wrapper', { valueNames: ['topicnro','topic-title', 'topicid', 'topic-date', 'topicanio', 'topicdistrito','topicarea','topicedad'] })

  
      //Filtro la lista por año actual
      
      let option = '2019'
      this.list.filter(function(item) {
      return (item.values().topicanio.includes(option))  
   })
 
    this.list.sort("topicnro", {order: 'asc'})

        ReactRender(
        (<UpdateStage
        forum={this.forum} />),
        this.el[0].querySelector('.update-stage'));

        ReactRender(
        (<ExportUpdate
        forum={this.forum} />),
        this.el[0].querySelector('.export-update'));

        ReactRender(
         <div className='filtros'>
          <div className='row'>
          <div className= "col-lg-4 filtroAnio">
            <label className='filtro-label'>
              Año
            </label>
            <select className='select-filtro' defaultValue="2019" id='anio' onChange={this.chooseAnio}>
              {anios.map((anio, i)=> {
                return <option value={anio.name} key={i}>{anio.title}</option>
              })}
            </select>
              </div>
            <div className='col-lg-4 filtroModalidad'>
            <label className='filtro-label'>
              Modalidad
            </label>
            <select className='select-filtro' defaultValue="Todos" id="modalidad" onChange={this.chooseAnio}>
              {modalidades.map((modalidad, i)=> {
                return <option value={modalidad.name} key={i}>{modalidad.title}</option>
              })}

            </select>
          </div>
          <div className='col-lg-4 filtroDistrito'>
            <label className='filtro-label'>
              Distrito
            </label>
            <select className='select-filtro' defaultValue="Todos" id="distrito" onChange={this.chooseAnio}>
              {distritos.map((distrito, i)=> {
                return <option value={distrito.name} key={i}>{distrito.title}</option>
              })}

            </select>
          </div>
          </div>
        </div>,
        this.el[0].querySelector('.filtros'));
        console.log (this.el[0].querySelector('.filtros'))

      }


  }

  ondeletetopicclick (ev) {
    ev.preventDefault()
    //const el = ev.delegateTarget.parentElement
    //const topicId = el.getAttribute('data-topicid')
    //las 2 lineas anteriores no funcionan, por eso obtengo el data-topicid de la siguiente linea
    const  topicId= ev.path[4].getAttribute('data-topicid')
    //if(!topicId) debugger

    const _t = (s) => t(`admin-topics-form.delete-topic.confirmation.${s}`)

    const onconfirmdelete = (ok) => {
      if (!ok) return
      topicStore.destroy(topicId)
        .catch((err) => {
          log('Found error %o', err)
        })
        this.list.remove("topicid",topicId)
      
    }

    confirm(_t('title'), _t('body'))
      .cancel(_t('cancel'))
      .ok(_t('ok'))
      .modal()
      .closable()
      .effect('slide')
      .show(onconfirmdelete)
  }
}

