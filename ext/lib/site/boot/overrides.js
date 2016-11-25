import * as Layout from 'lib/site/layout/component'
import * as LayoutOverride from 'ext/lib/site/layout/component'

import * as Header from 'lib/site/header/component'
import * as HeaderOverride from 'ext/lib/site/header/component'

import * as HomeMultiforum from 'lib/site/home-multiforum/component'
import * as HomeMultiforumOverride from 'ext/lib/site/home-multiforum/component'

import * as HomeForum from 'lib/site/home-forum/component'
import * as HomeForumOverride from 'ext/lib/site/home-forum/component'

import * as TopicLayoutSidebar from 'lib/site/topic-layout/sidebar/component'
import * as TopicLayoutSidebarOverride from 'ext/lib/site/topic-layout/sidebar/component'

import * as TopicArticle from 'lib/site/topic-layout/topic-article/component'
import * as TopicArticleOverride from 'ext/lib/site/topic-layout/topic-article/component'

import * as CommentList from 'lib/site/topic-layout/topic-article/comments/list/component'
import * as CommentListOverride from 'ext/lib/site/topic-layout/topic-article/comments-list/component'

import * as CommentRepliesList from 'lib/site/topic-layout/topic-article/comments/list/replies/list/component'
import * as CommentRepliesListOverride from 'ext/lib/site/topic-layout/topic-article/comments-replies-list/component'


Object.assign(Layout, LayoutOverride)
Object.assign(Header, HeaderOverride)
Object.assign(HomeMultiforum, HomeMultiforumOverride)
Object.assign(HomeForum, HomeForumOverride)
Object.assign(TopicLayoutSidebar, TopicLayoutSidebarOverride)
Object.assign(TopicArticle, TopicArticleOverride)
Object.assign(CommentList, CommentListOverride)
Object.assign(CommentRepliesList, CommentRepliesListOverride)
