/**
 * Module dependencies.
 */
import React from 'react'
//import React, { Component } from 'react'
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
  {'name': 'sudoeste', 'title': 'Sudoeste'},
  {'name': 'sur', 'title': 'Sur'},

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
    this.topics = topics
    this.forum = forum
    this.pagination = pagination
    //bind evento para filtrar
    this.chooseAnio = this.chooseAnio.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
 
  }
  
  //Evento para filtrar/data-/g
  chooseAnio(event) {

    /*var url = window.location.href.replace(window.location.search,'')
    console.log(url)*/
    //Obtengo los valores de cada select para mantener los filtros

    //console.log(this.getHashVariable("anio"))
    
    var aniohtml = document.getElementById('anio')
    var anio = aniohtml.options[aniohtml.selectedIndex].text
    var modalidadhtml = document.getElementById('modalidad')
    var modalidad = modalidadhtml.options[modalidadhtml.selectedIndex].text
    var distritohtml = document.getElementById('distrito')
    var distritotitle = distritohtml.options[distritohtml.selectedIndex].text
   //Adapto el filtro distrito al valor que tiene la lista
    var distrito = "Distrito ".concat(distritotitle.toLowerCase())
    ////Defino valor vacio para filtrar con la opcion "Todos"
      if (anio === "Todos") { anio = ""}
      if (distrito === "Distrito todos"){ 
        distrito=""
        distritotitle=""}
      if (modalidad === "Todos"){ modalidad=""}
       
        // Obtengo las opciones seleccionadas

      
    //armo el hash
    /*console.log(distrito.substring(9,13))*/

    //Filtro la lista
    this.list.filter(function(item) {
    return item.values().topicanio.includes(anio) && item.values().topicedad.includes(modalidad)  && item.values().topicdistrito.substring(9,13).includes(distrito.substring(9,13))
    })
    
   this.list.update()

    this.list.sort("topicnro", {order: 'asc'})
    
    var filtros = 'anio=' + anio + '&' +'modalidad=' + modalidad + '&' + 'distrito=' + distritotitle.toLowerCase()
    
  
    window.location.hash= `#${filtros}`
    
    if(window.location.search){window.location.search= ``}

}

  switchOn () {
    this.bind('click', '.btn.delete-topic', this.bound('ondeletetopicclick'))
    this.list = new List('topics-wrapper', { valueNames: ['topic-title', 'topicid', 'topic-date', 'topicanio', 'topicdistrito','topicedad'] })

  

   if (this.forum.name === 'presupuesto' && this.forum.privileges.canEdit){
    this.list = new List('topics-wrapper', { valueNames: ['topicnro','topic-title', 'topicid', 'topic-date', 'topicanio', 'topicdistrito','topicarea','topicedad'] })

      //Obtengo los hash de los filtros

      //window.location.hash = `#anio=2019&modalidad=&distrito=`

      //Filtro la lista por año actual
      
     let anioinicial = this.getHashVariable("anio") === null ? "2019" : this.getHashVariable("anio")[1]
     let modalidadinicial = this.getHashVariable("modalidad") === null ? "" : this.getHashVariable("modalidad")[1]
     let distritoinicial = this.getHashVariable("distrito") === null ? "" : this.getHashVariable("distrito")[1]


    //let distritoini =  distritoinicial.substring(11)
    let distritoini = distritoinicial.replace("%20","")

    this.list.filter(function(item) {
    return item.values().topicanio.includes(anioinicial) && item.values().topicedad.includes(modalidadinicial) && item.values().topicdistrito.substring(9,13).includes(distritoini.substring(0,4))
    })
    this.list.sort("topicnro", {order: 'asc'})

   

    //console.log(this.list.matchingItems.length)
    this.pagination.count = this.list.matchingItems.length
    

    const pages = this.pagination.count / 100
    //console.log(pages)
    /*console.log(this.pagination.count)*/
    const currentPage = (+getQueryVariable('page') || 1) - 1
    ReactRender((
      <ReactPaginate
        forcePage={currentPage}
        pageCount={pages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        previousLabel='<'
        nextLabel='>'
        onPageChange={this.handlePageClick}
        breakLabel={<a href="">...</a>}
        breakClassName={"break-me"}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"} />
    ), this.el[0].querySelector('.topics-pagination'))
 

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
            <select className='select-filtro' id='anio' defaultValue={this.getHashVariable("anio") === null ? "2019" : this.getHashVariable("anio")[1] } onChange={this.chooseAnio}>
              {anios.map((anio, i)=> {
                return <option value={anio.name} key={i}>{anio.title}</option>
              })}
            </select>
              </div>
            <div className='col-lg-4 filtroModalidad'>
            <label className='filtro-label'>
              Modalidad
            </label>
            <select className='select-filtro' defaultValue={this.getHashVariable("modalidad") === null ? "Todos" : this.getHashVariable("modalidad")[1] } id="modalidad" onChange={this.chooseAnio}>
              {modalidades.map((modalidad, i)=> {
                return <option value={modalidad.name} key={i}>{modalidad.title}</option>
              })}

            </select>
          </div>
          <div className='col-lg-4 filtroDistrito'>
            <label className='filtro-label'>
              Distrito
            </label>
            <select className='select-filtro' defaultValue={this.getHashVariable("distrito") === null ? "Todos" : this.getHashVariable("distrito")[1] } id="distrito" onChange={this.chooseAnio}>
              {distritos.map((distrito, i)=> {
                return <option value={distrito.name} key={i}>{distrito.title}</option>
              })}

            </select>
          </div>
          </div>
        </div>,
        this.el[0].querySelector('.filtros'));

      }
   if (this.forum.name === 'consultas' && this.forum.privileges.canEdit){
        ReactRender(
        (<ExportUpdate
        forum={this.forum} />),
        this.el[0].querySelector('.export-update'));
      }

  }

  

  ondeletetopicclick (ev) {
    ev.preventDefault()
    const el = ev.delegateTarget
    const topicId = el.getAttribute("data-topicid")
   

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

 handlePageClick (e) {
    var anio = this.getHashVariable('anio')[1] || ''
    var modalidad = this.getHashVariable('modalidad')[1] || ''
    var distrito = this.getHashVariable('distrito')[1] || ''
    
    var aniohtml = document.getElementById('anio')
    var anioinicio = aniohtml.options[aniohtml.selectedIndex].text

    if (anioinicio==='2019'){
      anio = anioinicio
    }

    const { origin, pathname, hash } = window.location
    
    
    window.location = `${origin}${pathname}?page=${(e.selected + 1)}#anio=${anio}&modalidad=${modalidad}&distrito=${distrito}`

    this.list.filter(function(item) {
    return item.values().topicanio.includes(anio) && item.values().topicedad.includes(modalidad)  && item.values().topicdistrito.substring(9,13).includes(distrito.substring(0,4))
    })
  }

getHashVariable(key) {
    var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
    return matches ? matches : null;
  }

}