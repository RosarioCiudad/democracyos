import * as profile from 'lib/settings/settings-profile/view'
import * as profileOverride from 'ext/lib/settings/settings-profile/view'

profile.default = profileOverride.default


import * as settings from 'lib/settings/settings/settings'
import * as settingsOverride from 'ext/lib/settings/settings/settings'

Object.assign(settings,settingsOverride)

import * as view from 'lib/settings/settings-user-badges/view'
import * as viewOverride from 'ext/lib/settings/settings-user-badges/view'

Object.assign(view, viewOverride)

import * as settingsContainer from 'lib/settings/settings/settings-container.jade'
import * as settingsContainerOverride from 'ext/lib/settings/settings/settings-container.jade'

Object.assign(settingsContainer, settingsContainerOverride)