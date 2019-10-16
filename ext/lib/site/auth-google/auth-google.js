import 'lib/boot/routes'
import router from 'lib/site/boot/router'
import BtnGoogle from '../sign-in/btn-google'
import Confirm from './confirm/component'

BtnGoogle.defaultProps.action = '/auth/google/confirm'

router.childRoutes.unshift({
  path: '/auth/google/confirm/authorize',
  component: Confirm
})