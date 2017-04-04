import React from 'react'
import { Route } from 'react-router'
import 'lib/boot/routes'
import router from 'lib/site/boot/router'
import SignupComplete from './component'

router.childRoutes.unshift(
  <Route
    key='ext-signup-complete'
    path='/signup/complete'
    component={SignupComplete} />
)
