import React, { Component } from 'react'
import ReactOutsideEvent from 'react-outside-event'
import update from 'immutability-helper'
import distritos from '../distritos.json'

class FiltersNavbar extends Component {
  constructor (props) {
    super(props)

    const defaultFilters = {
      distrito: {
        centro: false,
        noroeste: false,
        norte: false,
        oeste: false,
        sudoeste: false,
        sur: false,
        none: false
      },
      edad: {
        adulto: false,
        joven: false
      },
      anio: {
        proyectos2017: false,
        proyectos2018: false,
        proyectos2019: false,
        proyectos2020: false
      },
      estado: {
        proyectado: false,
        ejecutandose: false,
        terminado: false
      }
    }

    this.state = {
      appliedFilters: defaultFilters,
      selectFilters: defaultFilters,
      badges: {
        distrito: 0,
        edad: 0,
        anio: 0,
        estado: 0
      },
      activeDropdown: '',
      forum: ''
    }
    this.filtersCache = null
  }
  componentWillReceiveProps (props) {
    let stageType = props.stage === 'seguimiento' ? 'seguimiento' : 'votacion'
    let memFilters = JSON.parse(sessionStorage.getItem(`filtros-${stageType}`))
    const proyectos = JSON.parse(sessionStorage.getItem('pp-proyectos')) || []
    const votacionEnProceso = proyectos.length > 0
    /*Verifico si se utilizo algun filtro en la sesion*/
    if(memFilters){
      let distritosvalues = Object.values(memFilters.distrito)
      let distritosfiltrados = distritosvalues.toString().indexOf('false')
  
      //agrego condición en el if de distritosfiltrados que determina si se uso o no un filtro para guardarlo en la sesion.
      if (!votacionEnProceso && distritosfiltrados > -1 ) {
        this.setState({ appliedFilters: memFilters }, this.exposeFilters)
        return
      }
   }
    if (props.stage !== this.props.stage) {
      let nextFilters = {
        distrito: {
          centro: false,
          noroeste: false,
          norte: false,
          oeste: false,
          sudoeste: false,
          sur: false
        },
        edad: {
          adulto: false,
          joven: false
        },
        anio: {
          proyectos2017: false,
          proyectos2018: false,
          proyectos2019: false,
          proyectos2020: false
        },
        estado: {
          proyectado: false,
          ejecutandose: false,
          terminado: false
       

        }
     
      }

      switch (props.stage) {
        case 'votacion-abierta':
          const ppStatus = JSON.parse(localStorage.getItem('ppStatus')) || {}
          const distrito = votacionEnProceso ? proyectos[0].attrs.district : 'none'
          const padron = ppStatus.padron === 'mixto'
            ? sessionStorage.getItem('pp-padron') || 'adulto'
            : ppStatus.padron || 'adulto'

          nextFilters.estado.pendiente = true
          nextFilters.anio.proyectos2018 = false
          nextFilters.anio.proyectos2019 = false
          nextFilters.anio.proyectos2020 = true
          nextFilters.edad[padron] = true
          nextFilters.distrito[distrito] = true
          break
        case 'votacion-cerrada':
          nextFilters.estado.proyectado = true
          nextFilters.estado.perdedor = true
          nextFilters.anio.proyectos2018 = false
          nextFilters.anio.proyectos2019 = false
          nextFilters.anio.proyectos2020 = true
          nextFilters.edad.adulto = true
          nextFilters.distrito.centro = true
          break
        case 'seguimiento':
          nextFilters.edad.adulto = true
          nextFilters.anio.proyectos2020 = false
          nextFilters.anio.proyectos2019 = true
          nextFilters.anio.proyectos2018 = false
          break
      }

      this.setState({ appliedFilters: nextFilters }, this.exposeFilters)
    }
  }


  // FUNCTIONS
  handleDistritoFilterChange = (distrito) => {
    // resetea los filtros
    let appliedFilters = update(this.state.appliedFilters, {
      distrito: {
        centro: { $set: false },
        noroeste: { $set: false },
        norte: { $set: false },
        oeste: { $set: false },
        sudoeste: { $set: false },
        sur: { $set: false },
        none: { $set: false }
      }
    })
    // setea el filtro activo
    appliedFilters.distrito[distrito.name] = true

    // aplica los filtros actualizados
    this.setState({
      appliedFilters: appliedFilters
    }, () => {
      this.exposeFilters()
    })
  }

  handleEdadFilterChange = (edad) => {
    //  resetea el filtro edad
    let appliedFilters = update(this.state.appliedFilters, {
      edad: {
        adulto: { $set: false },
        joven: { $set: false }
      }
    })
    //  actualiza filtro edad con la opcion elegida
    appliedFilters.edad[edad] = true
    //  aplica los filtros actualizados
    this.setState({
      appliedFilters: appliedFilters
    }, () => {
      this.exposeFilters()
    })
  }

  handleDropdown = (id) => (e) => {
    //  si se apreta el botón de un dropdown ya abierto, se cierra
    if (this.state.activeDropdown === id) {
      this.setState({ activeDropdown: '' })
    } else {
      // se actualiza selectFilters y se abre el dropdown
      this.setState({
        selectFilters: update(this.state.appliedFilters, { $merge: {} }),
        activeDropdown: id
      })
    }
  }

  // cerrar dropdown si hago click afuera
  onOutsideEvent = () => {
    if (!this.state.activeDropdown) return
    this.setState({ activeDropdown: '' })
  }

  handleCheckboxChange = (select) => (e) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const id = target.id
    let selectFilters = update(this.state.selectFilters, { [select]: { [id]: { $set: value } } })

    this.setState({
      selectFilters: selectFilters
    }, function () {
    })
  }

  cancelApplyFilters = () => {
    this.setState({
      // se actualiza selectFilters y se cierra el dropdown
      selectFilters: update(this.state.appliedFilters, { $merge: {} }),
      activeDropdown: ''
    })
  }

  applyFilters = (id) => (e) => {
    this.setState({
      // actualiza appliedFilters y cierra el dropdown
      appliedFilters: update(this.state.selectFilters, { $merge: {} }),
      activeDropdown: ''
    }, () => {
      this.exposeFilters()
      this.calculateBadges()
    })
  }

  // prepara los filtros para enviar la query definitiva a la API
  exposeFilters = () => {
    let exposedFilters = this.filterCleanup(this.state.appliedFilters)
    let stageType
    if (!this.props.stage) return
    switch (this.props.stage) {
      case 'seguimiento':
        stageType = 'seguimiento'
        exposedFilters.estado.pendiente = false
        exposedFilters.estado.perdedor = false
        break
      case 'votacion-abierta':
        stageType = 'votacion'
        exposedFilters.estado.perdedor = false
        break
      case 'votacion-cerrada':
        stageType = 'votacion'
        exposedFilters.estado.pendiente = false
        break
    }

    let strFilters = JSON.stringify(exposedFilters)
    if (this.props.stage === 'seguimiento') this.calculateBadges()
    if (!stageType) console.log('this.props.stage', this.props.stage)
    if (strFilters === this.filtersCache) return
    this.filtersCache = strFilters
    sessionStorage.setItem(`filtros-${stageType}`, strFilters)
    this.props.updateFilters(exposedFilters)
  }

  calculateBadges = () => {
    let badges = Object.keys(this.state.appliedFilters)
      .map((f) => [f, Object.values(this.state.appliedFilters[f]).filter((boolean) => boolean).length])
      .reduce((acc, f) => { acc[f[0]] = f[1]; return acc }, {})

    this.setState({ badges })
  }

  filterCleanup = (filters) => {
    let createTransformation = (ob) => {
      let transformation = {}
      Object.keys(ob).forEach((k) => {
        if (!(Object.values(ob[k]).includes(true))) {
          transformation[k] = typeof ob[k] !== 'object' ? { $set: true } : createTransformation(ob[k])
        }
        if (this.props.stage === 'seguimiento' && k === 'estado' && ob[k].pendiente) {
          transformation[k] = typeof ob[k] !== 'object' ? { $set: true } : createTransformation(ob[k])
          ob[k].pendiente = false
        }
      })
      return transformation
    }
    return update(filters, createTransformation(filters))
  }

  changeColor = (id) => {
    if (this.state.badges[id] > 0) {
      return 'applied-filter'
    } else {
      return ''
    }
  }

// RENDER
  render () {
    return (
      <div>
        {(this.props.stage === 'votacion-abierta' || this.props.stage === 'votacion-cerrada') && (
          <DistritoFilter
            active={this.state.distrito}
            onChange={this.handleDistritoFilterChange}
            changeEdad={this.handleEdadFilterChange}
            changeStage={this.props.changeStage}
            stage={this.props.stage}
            appliedFilters={this.state.appliedFilters} />
        )}
        {this.props.stage === 'seguimiento' && (
          <header>
              {(this.props.forumStage === 'votacion-abierta' || this.props.forumStage === 'votacion-cerrada') && (
                <a
                  className='link-stage'
                  onClick={() => { this.props.changeStage(this.props.forumStage) }}>
                    Volver a Votación
                </a>
              )
            }
            <div className='stage-header'>
              <div className='pp-stage'>
                Seguimiento de proyectos
              </div>

              <nav className='pp-nav'>
                <button
                  type='button'
                  data-name='adulto'
                  onClick={() => this.handleEdadFilterChange('adulto')}
                  className={`btn btn-md btn-outline-primary ${this.state.appliedFilters.edad.adulto ? 'active' : ''}`}>
                  <span className='btn-content'><span className='btn-text'>Presupuesto Participativo</span></span>
                </button>
                <button
                  type='button'
                  data-name='joven'
                  onClick={() => {this.handleEdadFilterChange('joven')}}
                  className={`btn btn-md btn-outline-primary ${this.state.appliedFilters.edad.joven ? 'active' : ''}`}>
                  <span className='btn-content'><span className='btn-text'>Presupuesto Participativo Joven</span></span>
                </button>
              </nav>
              <p className='header-text'>Filtros adicionales:</p>
            </div>

            <nav>
              <div className='filter'>
                <button
                  type='button'
                  id='filtro-distrito'
                  className={`btn btn-md btn-outline-primary ${this.changeColor('distrito')}`}
                  onClick={this.handleDropdown('opciones-distrito')}>
                  <span className='btn-content'><span className='btn-text'>Distrito</span> {this.state.badges.distrito !== 0 && <span className='badge'>{this.state.badges.distrito}</span>} </span> <span className='caret-down'>▾</span>
                </button>
                {this.state.activeDropdown === 'opciones-distrito' && (
                  <div className='filter-dropdown' id='opciones-distrito'>

                    <div className='filter-options'>

                      <div className='filter-column'>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='centro' name='distrito' checked={this.state.selectFilters.distrito.centro} />
                            <label htmlFor='centro'></label>
                          </div>
                          <label htmlFor='centro'>Centro</label>
                        </div>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='noroeste' name='distrito' checked={this.state.selectFilters.distrito.noroeste} />
                            <label htmlFor='noroeste'></label>
                          </div>
                          <label htmlFor='noroeste'>Noroeste</label>
                        </div>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='norte' name='distrito' checked={this.state.selectFilters.distrito.norte} />
                            <label htmlFor='norte'></label>
                          </div>
                          <label htmlFor='norte'>Norte</label>
                        </div>
                      </div>

                      <div className='filter-column'>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='oeste' name='distrito' checked={this.state.selectFilters.distrito.oeste} />
                            <label htmlFor='oeste'></label>
                          </div>
                          <label htmlFor='oeste'>Oeste</label>
                        </div>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='sudoeste' name='distrito' checked={this.state.selectFilters.distrito.sudoeste} />
                            <label htmlFor='sudoeste'></label>
                          </div>
                          <label htmlFor='sudoeste'>Sudoeste</label>
                        </div>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('distrito')} type='checkbox' id='sur' name='distrito' checked={this.state.selectFilters.distrito.sur} />
                            <label htmlFor='sur'></label>
                          </div>
                          <label htmlFor='sur'>Sur</label>
                        </div>
                      </div>

                    </div>
                    <div className='dropdown-actions'>
                      <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
                      <a className='aplicar' onClick={this.applyFilters('distrito')}>Aplicar</a>
                    </div>
                  </div>
                  )}
              </div>

              <div className='filter'>
                <button
                  type='button'
                  id='filtro-anio'
                  className={`btn btn-md btn-outline-primary ${this.changeColor('anio')}`}
                  onClick={this.handleDropdown('opciones-anio')}>
                  <span className='btn-content'><span className='btn-text'>Año</span> {this.state.badges.anio !== 0 && <span className='badge'>{this.state.badges.anio}</span>} </span> <span className='caret-down'>▾</span>
                </button>
                {this.state.activeDropdown === 'opciones-anio' && (
                  <div className='filter-dropdown' id='opciones-anio'>
                    <div className='filter-options'>
              
                      <div className='filter-column'>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('anio')} type='checkbox' id='proyectos2017' name='anio' checked={this.state.selectFilters.anio.proyectos2017} />
                            <label htmlFor='proyectos2017'></label>
                          </div>
                          <label htmlFor='proyectos2017'>2017</label>
                        </div>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('anio')} type='checkbox' id='proyectos2018' name='anio' checked={this.state.selectFilters.anio.proyectos2018} />
                            <label htmlFor='proyectos2018'></label>
                          </div>
                          <label htmlFor='proyectos2018'>2018</label>
                        </div>
                        
                          <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('anio')} type='checkbox' id='proyectos2019' name='anio' checked={this.state.selectFilters.anio.proyectos2019} />
                            <label htmlFor='proyectos2019'></label>
                          </div>
                          <label htmlFor='proyectos2019'>2019</label>
                          </div>

                          <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('anio')} type='checkbox' id='proyectos2020' name='anio' checked={this.state.selectFilters.anio.proyectos2020} />
                            <label htmlFor='proyectos2020'></label>
                          </div>
                          <label htmlFor='proyectos2020'>2020</label>
                          </div>
                          
                      </div>
                    </div>
                    <div className='dropdown-actions'>
                      <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
                      <a className='aplicar' onClick={this.applyFilters('anio')}>Aplicar</a>
                    </div>
                  </div>
                  )}
              </div>

              <div className='filter'>
                <button
                  type='button'
                  id='filtro-estado'
                  className={`btn btn-md btn-outline-primary ${this.changeColor('estado')}`}
                  onClick={this.handleDropdown('opciones-estado')}>
                  <span className='btn-content'><span className='btn-text'>Estado</span> {this.state.badges.estado !== 0 && <span className='badge'>{this.state.badges.estado}</span>} </span> <span className='caret-down'>▾</span>
                </button>
                {this.state.activeDropdown === 'opciones-estado' && (
                  <div className='filter-dropdown' id='opciones-estado'>
                    <div className='filter-options'>

                      <div className='filter-column'>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('estado')} type='checkbox' id='proyectado' name='estado' checked={this.state.selectFilters.estado.proyectado} />
                            <label htmlFor='proyectado'></label>
                          </div>
                          <label htmlFor='proyectado'>Proyectados</label>
                        </div>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('estado')} type='checkbox' id='ejecutandose' name='estado' checked={this.state.selectFilters.estado.ejecutandose} />
                            <label htmlFor='ejecutandose'></label>
                          </div>
                          <label htmlFor='ejecutandose'>En ejecución</label>
                        </div>
                        <div className='option-container'>
                          <div className='check-container'>
                            <input onChange={this.handleCheckboxChange('estado')} type='checkbox' id='terminado' name='estado' checked={this.state.selectFilters.estado.terminado} />
                            <label htmlFor='terminado'></label>
                          </div>
                          <label htmlFor='terminado'>Terminados</label>
                        </div>
                      </div>

                    </div>

                    <div className='dropdown-actions'>
                      <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
                      <a className='aplicar' onClick={this.applyFilters('estado')}>Aplicar</a>
                    </div>
                  </div>
                  )}
              </div>
            </nav>
          </header>
        )}
      </div>
    )
  } // cierra el render
} // cierra el componente

export default ReactOutsideEvent(FiltersNavbar)

// Navbar en votacion abierta / votacion cerrada

function DistritoFilter (props) {
  const { onChange, stage, appliedFilters, changeEdad, changeStage } = props
  const active = Object.keys(appliedFilters.distrito)[Object.values(appliedFilters.distrito).map((d, i) => [d, i]).filter(d => d[0])[0][1]]
  const ppStatus = JSON.parse(localStorage.getItem('ppStatus')) || {}
  const proyectos = JSON.parse(sessionStorage.getItem('pp-proyectos')) || []
  const votacionEnProceso = proyectos.length > 0
  const stageType = props.stage === 'seguimiento' ? 'seguimiento' : 'votacion'
  const memFilters = JSON.parse(sessionStorage.getItem(`filtros-${stageType}`))
  return (
    <header>
      { stage === 'votacion-abierta' && (
      <div>
        <a className='link-stage'
          onClick={() => { changeStage('seguimiento') }}>
          Ir a Seguimiento de Proyectos
        </a>
        <div className='stage-header'>
          <div className='pp-stage'>
            Votación Abierta
          </div>
          <nav className='pp-nav'>
            <button
              type='button'
              data-name='adulto'
              onClick={() => {
                if (votacionEnProceso && ppStatus.padron === 'joven') return
                changeEdad('adulto')
              }}
              className={`btn btn-md btn-outline-primary ${appliedFilters.edad.adulto ? 'active' : ''} ${(votacionEnProceso && ppStatus.padron === 'joven') ? 'disabled' : ''}`}>
              <span className='btn-content'><span className='btn-text'>Presupuesto Participativo</span></span>
            </button>
            <button
              type='button'
              data-name='joven'
              onClick={() => {
                if (votacionEnProceso && ppStatus.padron === 'adulto') return
                changeEdad('joven')
              }}
              className={`btn btn-md btn-outline-primary ${appliedFilters.edad.joven ? 'active' : ''} ${(votacionEnProceso && ppStatus.padron === 'adulto') ? 'disabled' : ''}`}>
              <span className='btn-content'><span className='btn-text'>Presupuesto Participativo Joven</span></span>
            </button>
          </nav>
          <p className='header-text'>Elegí tu distrito:</p>
        </div>
      </div>
      )}
      { stage === 'votacion-cerrada' && (
        <div>
          <a className='link-stage'
            onClick={() => { changeStage('seguimiento') }}>
            Ir a Seguimiento de Proyectos
          </a>
          <div className='stage-header'>
            <div className='pp-stage'>
              Resultados de votación
            </div>
            <nav className='pp-nav'>
              <button
                type='button'
                data-name='adulto'
                onClick={() => { changeEdad('adulto') }}
                className={`btn btn-md btn-outline-primary ${appliedFilters.edad.adulto ? 'active' : ''}`}>
                <span className='btn-content'><span className='btn-text'>Presupuesto Participativo</span></span>
              </button>
              <button
                type='button'
                data-name='joven'
                onClick={() => { changeEdad('joven') }}
                className={`btn btn-md btn-outline-primary ${appliedFilters.edad.joven ? 'active' : ''}`}>
                <span className='btn-content'><span className='btn-text'>Presupuesto Participativo Joven</span></span>
              </button>
            </nav>
            <p className='header-text header-text-cerrada'>Elegí tu distrito:</p>
          </div>
        </div>
      )}
      <nav>
        <div className='filter'>
          {distritos.map((d) => {
            if  (d.name !== 'none'){
              const isActive = d.name === active  ? 'active' : ''
              return (
                <button
                  type='button'
                  key={d.name}
                  data-name={d.name}
                  onClick={() => {
                    if (votacionEnProceso && proyectos[0].attrs.district !== d.name) return
                    onChange(d)
                  }}
                  className={`btn btn-md btn-outline-primary btn-votacion ${isActive} ${votacionEnProceso && proyectos[0].attrs.district !== d.name ? 'disabled' : ''}`}>
                  <span className='btn-content'><span className='btn-text'>{d.title}</span></span>
                </button>
              )
            }
          })}
        </div>
      </nav>
    </header>
  )
}