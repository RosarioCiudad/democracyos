var urlBuilder = require('lib/url-builder')


module.exports = function (multiForum) {
  var forum = multiForum ? '/:forum' : ''
  urlBuilder.register('site.forum', forum || '/')
  urlBuilder.register('site.topic', forum + '/topic/:id')
  urlBuilder.register('site.notifications', '/notifications')
  urlBuilder.register('forgot-email', '/forgot-email')
}