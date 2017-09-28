import React, { Component } from 'react'
import ReactOutsideEvent from 'react-outside-event'
import update from 'immutability-helper'
import distritos from '../distritos.json'

let distritoCurrent = ''

class FiltersNavbar extends Component {
  constructor (props) {
    super(props)

    this.state = {

      distrito: distritos[0],

      appliedFilters: {
        distrito: {
          centro: true,
          noroeste: true,
          norte: true,
          oeste: true,
          sudoeste: true,
          sur: true
        },
        edad: {
          adulto: true,
          joven: true
        },
        anio: {
          proyectos2015: true,
          proyectos2016: true,
          proyectos2017: true
        },
        estado: {
          proyectado: true,
          ejecutandose: true,
          finalizado: true
        }
      },

      selectFilters: {
        distrito: {
          centro: true,
          noroeste: true,
          norte: true,
          oeste: true,
          sudoeste: true,
          sur: true
        },
        edad: {
          adulto: true,
          joven: true
        },
        anio: {
          proyectos2015: true,
          proyectos2016: true,
          proyectos2017: true
        },
        estado: {
          proyectado: true,
          ejecutandose: true,
          finalizado: true
        }
      },

      badges: {
        distrito: 6,
        edad: 2,
        anio: 3,
        estado: 3
      },

      activeDropdown: ''
    }
  }

  componentWillMount() {
    if (this.props.stage === 'votacion-abierta') {
      this.setState({
        appliedFilters: update (this.state.appliedFilters, {
          estado: {
            proyectado: { $set: false },
            ejecutandose: { $set: false },
            finalizado: { $set: false },
            pendiente: { $set: true },
            perdedor: { $set: false }
          },
          anio: {
            proyectos2015: { $set: false },
            proyectos2016: { $set: false },
            proyectos2017: { $set: true }
          }
        })
      })
    } else if (this.props.stage === 'votacion-cerrada') {
      this.setState({
        appliedFilters: update (this.state.appliedFilters, {
          estado: {
            proyectado: { $set: true },
            ejecutandose: { $set: false },
            finalizado: { $set: false },
            pendiente: { $set: false },
            perdedor: { $set: true }
          },
          anio: {
            proyectos2015: { $set: false },
            proyectos2016: { $set: false },
            proyectos2017: { $set: true }
          }
        })
      })
    }
  }


  // FUNCTIONS

  handleDistritoFilterChange = (distrito) => {
    distritoCurrent = distrito.name
    window.history.pushState(null, null, `#${distrito.name}`)

    this.setState({
      appliedFilters: update(this.state.appliedFilters, { 
        distrito: { centro: { $set: false },
          noroeste: { $set: false },
          norte: { $set: false },
          oeste: { $set: false },
          sudoeste: { $set: false },
          sur: { $set: false }
        }
      })
    }, function() {
        this.setState({
        appliedFilters: update(this.state.appliedFilters, { distrito: { [distritoCurrent]: { $set: true } } })
      }, () => {
        this.exposeFilters()
      })
    }) 
  }

  handleDropdown = (id) => (e) => {
    // si se apreta el botón de un dropdown ya abierto, se cierra
    if (this.state.activeDropdown == id) {
      this.setState({activeDropdown: ''})
    } else {
      // se actualiza selectFilters y se abre el dropdown
      this.setState({
        selectFilters: update({}, { $merge: this.state.appliedFilters }),
        activeDropdown: id
      })
    }
  }

  // cerrar dropdown si hago click afuera
  onOutsideEvent = () => {
    if (!this.state.activeDropdown) return
    this.setState({activeDropdown: ''})
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
    var appliedFilters = this.state.appliedFilters
    this.setState ({
      // se actualiza selectFilters y se cierra el dropdown
      selectFilters: update({}, { $merge: this.state.appliedFilters}),
      activeDropdown: ''
    })
  }

  applyFilters = (id) => (e) => {
    this.setState ({
      // actualiza appliedFilters y cierra el dropdown
      appliedFilters: update({}, { $merge: this.state.selectFilters }),
      activeDropdown: ''
    }, () => {this.exposeFilters(id)})
  }

  // prepara los filtros para enviar la query definitiva a la API
  exposeFilters = (id) => {
    var exposedFilters = update({}, { $merge: this.state.appliedFilters })
    exposedFilters = update({}, { $merge: this.filterCleanup(exposedFilters) })
    this.setState ({
      appliedFilters: update({}, {$merge: exposedFilters})
    }, () => {
      // calcula y renderea el badge
      // agrega filtros extra de estado en stage seguimiento
      if (this.props.stage === 'seguimiento') {
        this.calculateBadges(id)
        exposedFilters.estado = update(exposedFilters.estado, {
          pendiente: { $set: false },
          perdedor: { $set: false }
        })
      }
      // query final
      console.log(exposedFilters)
      this.props.updateFilters(exposedFilters)
    })
  }


  calculateBadges = (id) => {
    var badgeNum = Object.values(this.state.appliedFilters[id]).filter(boolean => boolean).length
    this.setState (
      {badges: update(this.state.badges, { [id] : { $set: badgeNum } }) },
      )
  }


  filterCleanup = (filters) => {
    return Object.keys(filters).map(f => {
      if (Object.keys(filters[f]).filter(o => filters[f][o]).length === 0) {
          Object.keys(filters[f]).forEach(o => {
              filters[f][o] = true
          })
          return [f, filters[f]]
      } else {
          return [f, filters[f]]
      }
    }).reduce((acc, intFnOutput) => { acc[intFnOutput[0]] = intFnOutput[1]; return acc }, {})
  }


// RENDER

  render () {
    return (
      <div>
    {(this.props.stage === 'votacion-abierta' || this.props.stage === 'votacion-cerrada') && (
        <DistritoFilter
              active={this.state.distrito}
              onChange={this.handleDistritoFilterChange}
              stage={this.props.stage} />
    )}
    {this.props.stage === 'seguimiento' && (
        <header>

          <div className='stage-header'>
            <div className='pp-stage'>
              Seguimiento de proyectos
            </div>
            <p className='header-text'>Elegí tu filtro:</p>
          </div>

          <nav>
            <div className='filter'>
              <button
                type='button'
                id="filtro-distrito"
                className = 'btn btn-md btn-outline-primary'
                onClick = {this.handleDropdown('opciones-distrito')}>
                <span className='btn-content'><span className='btn-text'>Distrito</span> {this.state.badges.distrito !== 0 && <span className='badge'>{this.state.badges.distrito}</span>} </span> <span className='caret-down'>▾</span>
              </button>
              {this.state.activeDropdown == 'opciones-distrito' && (
                <div className='filter-dropdown' id="opciones-distrito">

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
                id="filtro-edad"
                className='btn btn-md btn-outline-primary'
                onClick={this.handleDropdown('opciones-edad')}
                >
                <span className='btn-content'><span className='btn-text'>Rango de edad</span> {this.state.badges.edad !== 0 && <span className='badge'>{this.state.badges.edad}</span>} </span> <span className='caret-down'>▾</span>
              </button>
              {this.state.activeDropdown == 'opciones-edad' && (
              <div className='filter-dropdown' id="opciones-edad">
                <div className='filter-options'>

                  <div className='filter-column'>
                    <div className='option-container'>
                      <div className='check-container'>
                        <input onChange={this.handleCheckboxChange('edad')} type='checkbox' id='adulto' name='edad' checked={this.state.selectFilters.edad.adulto} />
                        <label htmlFor='adulto'></label>
                      </div>
                      <label htmlFor='adulto'>Proyecto adultos</label>
                    </div>
                    <div className='option-container'>
                      <div className='check-container'>
                        <input onChange={this.handleCheckboxChange('edad')} type='checkbox' id='joven' name='edad' checked={this.state.selectFilters.edad.joven} />
                        <label htmlFor='joven'></label>
                      </div>
                      <label htmlFor='joven'>Proyecto jóvenes</label>
                    </div>
                  </div>

                </div>
                <div className='dropdown-actions'>
                  <a className='cancelar' onClick={this.cancelApplyFilters}>Cancelar</a>
                  <a className='aplicar' onClick={this.applyFilters('edad')}>Aplicar</a>
                </div>
              </div>
              )}
            </div>

            <div className='filter'>
              <button
                type='button'
                id="filtro-anio"
                className = 'btn btn-md btn-outline-primary'
                onClick = {this.handleDropdown('opciones-anio')}>
                <span className='btn-content'><span className='btn-text'>Año</span> {this.state.badges.anio !== 0 && <span className='badge'>{this.state.badges.anio}</span>} </span> <span className='caret-down'>▾</span>
              </button>
              {this.state.activeDropdown == 'opciones-anio' && (
                <div className='filter-dropdown' id="opciones-anio">
                  <div className='filter-options'>

                    <div className='filter-column'>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('anio')} type='checkbox' id='proyectos2015' name='anio' checked={this.state.selectFilters.anio.proyectos2015} />
                          <label htmlFor='proyectos2015'></label>
                        </div>
                        <label htmlFor='proyectos2015'>2015</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('anio')} type='checkbox' id='proyectos2016' name='anio' checked={this.state.selectFilters.anio.proyectos2016} />
                          <label htmlFor='proyectos2016'></label>
                        </div>
                        <label htmlFor='proyectos2016'>2016</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('anio')} type='checkbox' id='proyectos2017' name='anio' checked={this.state.selectFilters.anio.proyectos2017} />
                          <label htmlFor='proyectos2017'></label>
                        </div>
                        <label htmlFor='proyectos2017'>2017</label>
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
                id="filtro-estado"
                className = 'btn btn-md btn-outline-primary'
                onClick = {this.handleDropdown('opciones-estado')}>
                <span className='btn-content'><span className='btn-text'>Estado</span> {this.state.badges.estado !== 0 && <span className='badge'>{this.state.badges.estado}</span>} </span> <span className='caret-down'>▾</span>
              </button>
              {this.state.activeDropdown == 'opciones-estado' && (
                <div className='filter-dropdown' id="opciones-estado">
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
                          <input onChange={this.handleCheckboxChange('estado')}  type='checkbox' id='ejecutandose' name='estado' checked={this.state.selectFilters.estado.ejecutandose} />
                          <label htmlFor='ejecutandose'></label>
                        </div>
                        <label htmlFor='ejecutandose'>En ejecución</label>
                      </div>
                      <div className='option-container'>
                        <div className='check-container'>
                          <input onChange={this.handleCheckboxChange('estado')} type='checkbox' id='finalizado' name='estado' checked={this.state.selectFilters.estado.finalizado} />
                          <label htmlFor='finalizado'></label>
                        </div>
                        <label htmlFor='finalizado'>Finalizados</label>
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
  )} // cierra el render

} // cierra el componente

export default ReactOutsideEvent(FiltersNavbar)


function DistritoFilter (props) {
  const { active, onChange, stage } = props

  return (
    <header>
      <div className='stage-header'>
        <div className='pp-stage'>
          { stage === 'votacion-abierta' ? 'Votación abierta' : 'Votación cerrada' }
        </div>
        <p className='header-text'>Elegí tu distrito:</p>
      </div>
      <nav>
        <div className='filter'>
          {distritos.map((d) => {
            const isActive = d.name === active.name ? ' active' : ''
            return (
              <button
                type='button'
                key={d.name}
                data-name={d.name}
                onClick={() => onChange(d)}
                className={`btn btn-md btn-outline-primary${isActive} btn-votacion`}>
                <span className='btn-content'><span className='btn-text'>{d.title}</span></span>
              </button>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
