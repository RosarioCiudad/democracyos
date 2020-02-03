import React, { Component } from 'react'

export default ({ forum, topic, staff }) => {
  return (
    <div className={!staff ? 'attrs ocultarpara' : 'attrs'}>
      {forum.topicsAttrs.map((attr) => {
        const FormInput = forms[attr.kind]
        let val

        if (topic && topic.attrs && topic.attrs.hasOwnProperty(attr.name)) {
          val = topic.attrs[attr.name]
        }
        
        return <FormInput key={attr.name} {...attr} value={val} />
      })}
    </div>
  )
}

const forms = {}

forms.Number = ({
  name,
  title,
  description,
  mandatory,
  min,
  max,
  value
}) => (
  <div className='form-group kind-number'>
    <label>{title}</label>
    {description && <span className='help-text'>{description}</span>}
    <input
      className='form-control'
      type='number'
      name={`attrs.${name}`}
      defaultValue={value}
      min={min}
      max={max}
      required={mandatory}
      validate={mandatory && 'required'}
      disabled={name === 'votes'} 
      />
  </div>
)

forms.String = ({
  name,
  title,
  description,
  mandatory,
  placeholder,
  min,
  max,
  value
}) => (
  <div className='form-group kind-string'>
    <label>{title}</label>
    {description && <span className='help-text'>{description}</span>}
    <input
      className='form-control'
      type='text'
      name={`attrs.${name}`}
      defaultValue={name === 'anio' ? (value || '2020') : (name=== 'linkText' ? (value || 'Ver Noticias') : value)}
      placeholder={name=== 'iFrame' ? 'Ej: https://www.google.com/maps/d/embed?mid=1cHSzK4B4jGzZkU8-ehIO6Y1c_rY' : ''}
      minLength={min}
      maxLength={max}
      required={mandatory}
      validate={mandatory && 'required'} 
      />
  </div>
)

forms.Enum = ({
  name,
  title,
  description,
  mandatory,
  options,
  value
}) => (
  <div className='form-group kind-enum'>
    <label>{title}</label>
    {description && <span className='help-text'>{description}</span>}
    <select
      className='form-control'
      name={`attrs.${name}`}
      defaultValue={name='attrs.para' ? (value || 'belgrano2020') : value}
      required={mandatory}
      >
      {options.map((opt) => (
        <option key={opt.name} value={opt.name}>{opt.title}</option>
      ))}
    </select>
  </div>
)

/*forms.Enum = ({
  name,
  title,
  description,
  mandatory,
  options,
  value
}) => (
  <div className='form-group kind-enum'>
    <label>{title}</label>
    {description && <span className='help-text'>{description}</span>}
    <select
      className='form-control'
      name={`attrs.${name}`}
      defaultValue={name='attrs.para' ? (value || 'belgrano2020') : value}
      required={mandatory}
      >
      {options.map((opt) => (
        <option key={opt.name} value={opt.name}>{opt.title}</option>
      ))}
    </select>
  </div>
)*/

forms.Boolean = class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      checked: props.value
    }
  }

  handleChange = (evt) => {
    this.setState({
      checked: !this.state.checked
    })
  }

  render () {
    const {
      name,
      title,
      description,
      mandatory
    } = this.props

    return (
      <div className='checkbox kind-boolean'>
        <label>
          {!this.state.checked && (
            <input
              type='hidden'
              value='false'
              name={`attrs.${name}`} />
          )}
          <input
            type='checkbox'
            onChange={this.handleChange}
            defaultChecked={this.state.checked}
            defaultValue={this.state.checked ? 'true' : undefined}
            name={this.state.checked ? `attrs.${name}` : undefined}
            required={mandatory}
            validate={mandatory && 'required'} 
            />
          <span className='attrs-title'>{title}</span>
          {description && <span className='help-text'>{description}</span>}
        </label>
      </div>
    )
  }
}
