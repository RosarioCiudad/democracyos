/**
 * Module dependencies.
 */
import React from 'react'
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
import ExportUpdate from 'lib/admin/admin-topics/export-update/component'

const log = debug('democracyos:admin-topics')


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
    this.pagination = pagination

    this.onChangeAnio = this.onChangeAnio.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.selMouse = this.selMouse.bind(this)
  }
  

  selMouse(event) {
     event.preventDefault()
     console.log(event)
     // this.toggleClass('selected')
     // this.prop('selected', !this.prop('selected'))
    return false
     }


  onChangeAnio(event) {
    // Obtengo las opciones seleccionadas
    var anios = Array.from(event.target.selectedOptions, option => option.value)

    //concateno con "&"
    var valuehash = anios.join("&")
    //armo el hash
    window.location.hash = `#anio=${valuehash}`
    //filtro
    this.list.filter(function(item) {
     return ((anios).includes(item.values().topicanio) || !anios)
    })

    //preparo el paginado

    this.pagination.count = this.list.matchingItems.length
    
    const pages = this.pagination.count / 50
    const currentPage = (+getQueryVariable('page') || 1) - 1

    if (pages > 1) {
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
    }
  }

    

 
  switchOn () {
    this.bind('click', '.btn.delete-topic', this.bound('ondeletetopicclick'))    
    this.list = new List('topics-wrapper', { valueNames: ['topic-title', 'topic-id', 'topic-date', 'topicanio', 'topic-distrito'] })
    
    // if(this.list.visibleItems[]._values['topic-anio']==='2018'){console.log(this.list)}

   
   if (this.forum.name === 'presupuesto' && this.forum.privileges.canEdit){
    this.list = new List('topics-wrapper', { valueNames: ['topic-title', 'topic-id', 'topic-date', 'topicanio', 'topic-distrito'] })
       // var hashfiltro = this.getHashVariable('anio')
       // console.log(hashfiltro)
       // this.list.filter(function(item) {
       //    if (item.values().topicanio === '2018') {
       //     return true
       //    } else {
       //          return false}
       //  })        
        // this.list.filter(this.getHashVariable('anio') || '2018', ['topicanio'])
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
          <div className='titulo'>
           <h4>Filtrar proyectos</h4>
          </div>
          <div>
            <label className='filtro-label'>
              Año
            </label>
            <select className='select-filtro' multiple name="anio" id="anio" onMouseUp={this.selMouse} onChange={this.onChangeAnio}><option value="2017">2017</option><option value="2018">2018</option></select>
          </div>
        </div>,
        this.el[0].querySelector('.filtros'));
      }

            
        
    

    this.pagination.count = this.list.matchingItems.length
    const pages = this.pagination.count / 50
    const currentPage = (+getQueryVariable('page') || 1) - 1
    
    if (pages > 1) {
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
    }
  }

  handlePageClick (e) {
    var anio = this.getHashVariable('anio') || '2018'
    const { origin, pathname, hash } = window.location
    window.location = `${origin}${pathname}?page=${(e.selected + 1)}#anio=${anio}`
  }

  ondeletetopicclick (ev) {
    ev.preventDefault()
    const el = ev.delegateTarget.parentElement
    const topicId = el.getAttribute('data-topicid')
    if(!topicId) debugger

    const _t = (s) => t(`admin-topics-form.delete-topic.confirmation.${s}`)

    const onconfirmdelete = (ok) => {
      if (!ok) return

      topicStore.destroy(topicId)
        .catch((err) => {
          log('Found error %o', err)
        })
    }

    confirm(_t('title'), _t('body'))
      .cancel(_t('cancel'))
      .ok(_t('ok'))
      .modal()
      .closable()
      .effect('slide')
      .show(onconfirmdelete)
  }

// Obtiene el hash para mantener la lista filtrada en el paginado ?page=2#anio=2017

  getHashVariable(key) {
    var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
    return matches ? matches : null;
  }
}
