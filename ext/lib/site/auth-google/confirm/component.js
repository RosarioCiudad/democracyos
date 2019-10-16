import React from 'react'

export default () => {
  const user = window.initialState.authGoogleConfirmUser
  console.log(user)
  return (
    <div className='container-simple ext-auth-facebook-confirm'>
      <p className='title'>Ingresar como:</p>
      <div className='avatar'>
        <img src={user.avatar} alt={user.displayName} />
        <i className='icon-social-facebook' />
      </div>
      <h3 className='name'>{user.displayName}</h3>
      <a
        href='/auth/google'
        className='confirm btn btn-block btn-success'>
        Ingresar
      </a>
    </div>
  )
}
