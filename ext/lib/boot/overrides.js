import 'babel-polyfill'
import * as Header from 'lib/header/component'
import * as HeaderOverride from 'ext/lib/header/component'

Object.assign(Header, HeaderOverride)

import * as topicMiddlewares from 'lib/middlewares/topic-middlewares/topic-middlewares'
import * as topicMiddlewaresOverride from 'ext/lib/middlewares/topic-middlewares/topic-middlewares'

Object.assign(topicMiddlewares, topicMiddlewaresOverride)