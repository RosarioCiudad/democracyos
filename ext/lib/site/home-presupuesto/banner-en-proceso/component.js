import React from 'react'
import { withRouter } from 'react-router'

function cancelarVotacion (goTo) {
  return () => {
    sessionStorage.removeItem('pp-proyectos')
    sessionStorage.removeItem('pp-etapa')
    sessionStorage.removeItem('pp-padron')
    goTo('/presupuesto')
  }
}

export default withRouter(({ router }) => {
  const proyectos = JSON.parse(sessionStorage.getItem('pp-proyectos')) || []
  const votacionEnProceso = proyectos.length > 0

  return votacionEnProceso && (
    <div className='container-banner-votacion'>
      <p>Estás en proceso de votación.Elegí otro proyecto.</p>
      <button className='btn btn-md' onClick={cancelarVotacion(router.push)}>Cancelar votación</button>
    </div>
  )
})
