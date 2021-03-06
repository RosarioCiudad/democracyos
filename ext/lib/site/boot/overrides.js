import 'ext/lib/boot/overrides'

import * as HomeMultiforum from 'lib/site/home-multiforum/component'
import * as HomeMultiforumOverride from 'ext/lib/site/home-multiforum/component'

import * as HomeForum from 'lib/site/home-forum/component'
import * as HomeForumOverride from 'ext/lib/site/home-forum/component'

import * as TopicLayoutSidebar from 'lib/site/topic-layout/sidebar/component'
import * as TopicLayoutSidebarOverride from 'ext/lib/site/topic-layout/sidebar/component'

import * as TopicArticle from 'lib/site/topic-layout/topic-article/component'
import * as TopicArticleOverride from 'ext/lib/site/topic-layout/topic-article/component'

import * as SignUp from 'lib/site/sign-up/component'
import * as SignUpOverride from 'ext/lib/site/sign-up/component'

import * as Layout from 'lib/site/layout/component'
import * as LayoutOverride from 'ext/lib/site/layout/component'

import * as SignIn from 'lib/site/sign-in/component'
import * as SignInOverride from 'ext/lib/site/sign-in/component'


import * as Router from 'lib/site/boot/router'
import * as RouterOverride from 'ext/lib/site/boot/router'

import * as Routes from 'lib/site/boot/routes'
import * as RoutesOverride from 'ext/lib/site/boot/routes'

import * as Resend from 'lib/site/resend/component'
import * as ResendOverride from 'ext/lib/site/resend/component'

Object.assign(Router, RouterOverride)
Object.assign(Routes, RoutesOverride)
Object.assign(HomeMultiforum, HomeMultiforumOverride)
Object.assign(HomeForum, HomeForumOverride)
Object.assign(TopicLayoutSidebar, TopicLayoutSidebarOverride)
Object.assign(TopicArticle, TopicArticleOverride)
Object.assign(SignUp, SignUpOverride)
Object.assign(SignIn, SignInOverride)
Object.assign(Layout, LayoutOverride)
Object.assign(Resend, ResendOverride)