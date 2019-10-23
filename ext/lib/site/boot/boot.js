
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'

import 'lib/site/polyfills/polyfills'
import 'lib/boot/moment'
import 'lib/translations/translations'
import 'lib/analytics/analytics'
import '../user/user'
import '../auth-facebook/auth-facebook'
import '../auth-google/auth-google'
import './overrides'
import '../signup-complete/signup-complete'
import '../forgot-email/component'
import '../static-pages/static-pages'
/*
 * Register routes aliases
 */

import './routes'

/*
 * Import Site Router
 */
import router from './router'

/*
 * Compose react app
 */

render(
  <Router history={browserHistory} onUpdate={track} routes={router} />,
  document.getElementById('root')
)

function track () {
  if (window.analytics) window.analytics.page(window.location.pathname)
  if (window.ga) window.ga('send', 'pageview', window.location.pathname)
}