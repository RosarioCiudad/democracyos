import padStart from 'string.prototype.padstart'

export function prettyNumber (number) {
  if (!number) number = 1
  return `#${padStart(number, 3, '0')}`
}

export function prettyPrice (number) {
  return `$${prettyDecimals(number)}`
}

export function prettyDecimals (number) {
  if (typeof number === 'number') number = String(number)
  if (typeof number !== 'string') return ''
  if (number.length <= 3) return number

  number = number.split('').reverse().join('').match(/[0-9]{1,3}/g)

  return (number || [])
      .join('.')
      .split('')
      .reverse()
      .join('')
}

export function twitText (state, title) {
  switch (state) {
    case 'pendiente':
      return encodeURIComponent(`Mirá el proyecto que quiero para mi barrio #RosarioParticipa `)
    case 'perdedor':
      return encodeURIComponent(title)
    case 'proyectado':
      return encodeURIComponent('Este proyecto se va a realizar gracias a la participación de los vecinos. ')
    default:
      return ''
  }
}