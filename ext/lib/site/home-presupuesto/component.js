import React, { Component } from 'react'
import forumStore from 'lib/stores/forum-store/forum-store'
import userConnector from 'lib/site/connectors/user'
import Footer from '../footer/component'
import Cover from '../cover'
import TopicGrid from './topic-grid/component'
import FiltersNavbar from './filters-navbar/component'
import BannerPresupuesto from './banner-presupuesto/component'
import BannerVotoEnProceso from './banner-en-proceso/component'
import Countdown from './countdown/component'
import distritos from './distritos.json'
import Noticias from '../home-multiforum/noticias/component'
import Steps from './steps-votacion/component'

class HomePresupuesto extends Component {
  constructor (props) {
    super(props)
    this.state = {
      s: 0,
      noMore: false,
      loading: true,
      stage: null,
      cierre: null,
      forumStage: null,
      topics: [],
      edad: ['joven', 'adulto'],
      distrito: ['centro', 'noroeste', 'norte', 'oeste', 'sudoeste', 'sur'],
      anio: ['2017', '2018', '2019', '2020'],
      estado: ['proyectado', 'ejecutandose', 'terminado']
    }
  }

  componentDidMount () {
    this.setState({ loading: true }, this.fetchForum)
  }

  _fetchingForums = false
  fetchForum = () => {
    if (this._fetchingForums) return
    this._fetchingForums = true
    this.setState({ loading: true })

    forumStore.findOneByName('presupuesto')
    .then((forum) => {
      this.setState({
        loading: false,
        stage: forum.extra.stage,
        forumStage: forum.extra.stage,
        cierre: forum.extra.cierre
      })
    })
    .catch((err) => {
      this._fetchingForums = false
      console.error(err)
      this.setState({
        loading: false
      })
    })
  }

  fetchTopics (s) {
    const { edad, distrito, anio, estado } = this.state
    return window.fetch(`/ext/api/pp-feed`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ edad, distrito, anio, estado, s })
    })
    .then((res) => res.json())
    .then((res) => res.error ? Promise.reject(res.error) : Promise.resolve(res.result))
  }

  paginateFoward = () => {
    this.setState({ loading: true }, () => {
      let s = this.state.s
      s += 50
      this.fetchTopics(s)
        .then((topics) => {
          this.setState({
            loading: false,
            topics: this.state.topics.concat(topics),
            noMore: topics.length === 0 || topics.length < 50,
            s
          })
        })
        .catch((err) => {
          console.log(err)
          this.setState({ loading: false })
        })
    })
  }

  prepareTopics = () => {
    return distritos
      .filter(this.filtroDistritoCategoria)
      .map((distrito) => {
        distrito.topics = this.state.topics
          ? this.state.topics
              .filter(this.filtroEdad)
              .filter(this.filtroEstado)
              .filter(this.filtroAnio)
              .filter(this.filtroDistrito(distrito.name))
              .sort(genericSort)
          : []

        return distrito
      })
  }

  prepareFilters = (filtros) =>  {
    const edad = Object.keys(filtros.edad).filter(k => filtros.edad[k])
    const distritos = Object.keys(filtros.distrito).filter(k => filtros.distrito[k])
    const anios = Object.keys(filtros.anio)
      .filter(k =>  filtros.anio[k])
      .map(anio => {
        switch (anio) {
    case 'proyectos2017':
      return '2017'
    case 'proyectos2018':
      return '2018'
    case 'proyectos2019':
      return '2019'
    case 'proyectos2020':
      return '2020'
  }
      })

    const estado = Object.keys(filtros.estado).filter(k => filtros.estado[k])
    this.setState({
      edad: edad,
      distrito: distritos,
      anio: anios,
      estado: estado,
      s: 0
    }, () => {
      this.fetchTopics(0)
        .then((topics) => {
          this.setState({
            loading: false,
            topics,
            s: 0,
            noMore: topics.length === 0 || topics.length < 20
          })
        })
        .catch((err) => {
          console.error(err)
          this.setState({
            loading: false
          })
        })
    })
  }

  // Filter Functions

  filtroEdad = (topic) => {
    return topic.attrs && topic.attrs.edad && this.state.edad.includes(topic.attrs.edad)
  }

  filtroEstado = (topic) => {
    return topic.attrs && topic.attrs.state && this.state.estado.includes(topic.attrs.state)
  }

  filtroDistritoCategoria = (distrito) => {
    return this.state.distrito.includes(distrito.name)
  }

  filtroAnio = (topic) => {
    return topic.attrs && topic.attrs.anio && this.state.anio.includes(topic.attrs.anio)
  }

  filtroDistrito = (distritoName) => (topic) => {
    return topic.attrs && topic.attrs.district === distritoName
  }

  changeStage = (stage) => {
    this.setState({ stage })
  }
  
  

  render () {
    return (
      <div className='ext-home-presupuesto'>
        {
          this.state.cierre && this.state.stage === 'votacion-abierta'
          ? <Countdown
            cierre={this.state.cierre} />
          : <Cover
            background='/ext/lib/site/boot/presupuesto-participativo.jpg'
            logo='/ext/lib/site/home-multiforum/participa.svg'
            title='Presupuesto Participativo'
            description='Vos decidís cómo invertir parte del presupuesto de la ciudad. Podés elegir los proyectos que van a mejorar tu barrio y seguir su ejecución.' />
        }
        
        <Noticias tagName="presupuesto participativo" />
        { this.state.cierre && this.state.stage === 'votacion-abierta' && (
        <Steps />
        )}

        <div className='topics-section-container filters-wrapper'>
          <FiltersNavbar
            stage={this.state.stage}
            updateFilters={this.prepareFilters}
            changeStage={this.changeStage}
            forumStage={this.state.forumStage} />
        </div>
        <TopicGrid
          loading={this.state.loading}
          districts={this.prepareTopics()}
          age={this.state.edad}
          stage={this.state.stage}
          noMore={this.state.noMore}
          paginateFoward={this.paginateFoward} />
        {this.state.topics && (this.state.forumStage !== 'seguimiento' && this.state.forumStage !== 'votacion-abierta') &&
          <BannerPresupuesto
            forumStage={this.state.forumStage}
            stage={this.state.stage}
            changeStage={this.changeStage} />
        }
        {this.state.topics && this.state.forumStage === 'votacion-abierta' &&
          <BannerVotoEnProceso
            forumStage={this.state.forumStage}
            stage={this.state.stage}
            changeStage={this.changeStage} />
        }
        {this.state.topics &&
          <Footer />
        }
      </div>
    )
  }
}


export default userConnector(HomePresupuesto)

function estadoNum (e) {
  switch (e) {
    case 'terminado':
      return 1
    case 'ejecutandose':
      return 2
    case 'proyectado':
      return 3
    default:
      return 4
  }
}


function anioNum (e) {
  switch (e) {
    case '2020':
      return 1
    case '2019':
      return 2
    case '2018':
      return 3
    case '2017':
      return 4
    default:
      return 5
  }
}


    function genericSort(a,b){
        /*ordeno por area*/
        let areaA = a.attrs ? a.attrs.area : '';
        let areaB = b.attrs ? b.attrs.area : '';

        if (areaA < areaB) return -1;
        if (areaA > areaB) return 1;

        /*ordeno por año*/
        let anioA = anioNum(a.attrs && a.attrs.anio);
        let anioB = anioNum(b.attrs && b.attrs.anio);

        if (anioA < anioB) return 1;
        if (anioA > anioB) return -1;

        /*ordeno por estado*/
       
        let estadoA = estadoNum(a.attrs && a.attrs.state);
        let estadoB = estadoNum(b.attrs && b.attrs.state);

        if (estadoA < estadoB) return -1;
        if (estadoA > estadoB) return 1;

        return 0;
     }