import * as topicFormView from 'lib/admin/admin-topics-form/view'
import * as topicFormViewOverride from 'ext/lib/admin/admin-topics-form/view'

topicFormView.default = topicFormViewOverride.default

import * as topicListView from 'lib/admin/admin-topics/view'
import * as topicListViewOverride from 'ext/lib/admin/admin-topics/view'

topicListView.default = topicListViewOverride.default

import * as bodySerializer from 'lib/admin/admin-topics-form/body-serializer'
import * as bodySerializerOverride from 'ext/lib/admin/admin-topics-form/body-serializer'

bodySerializer.default = bodySerializerOverride.default

import * as admin from 'lib/admin/admin/admin'
import * as adminOverride from 'ext/lib/admin/admin/admin'

admin.default = adminOverride.default
