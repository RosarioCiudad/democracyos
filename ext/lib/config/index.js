const path = require('path')
const democracyosConfig = require('democracyos-config')
const clientConfig = require('lib/config/client')

const extConfig = module.exports = democracyosConfig({
  path: path.join(__dirname, '..', '..', 'config')
})

clientConfig.ext = clientConfig.ext || {}

extConfig.ext.client.forEach((k) => {
  clientConfig.ext[k] = extConfig.ext[k]
})
