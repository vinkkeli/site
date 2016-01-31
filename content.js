var contentful = require('contentful')
var marked = require('marked')
var mapValues = require('lodash.mapvalues')

if (!process.env.CONTENTFUL_ACCESS_TOKEN) {
  throw new Error('Requires contentful access token!')
}

var client = contentful.createClient({
  space: 'liv5z3rmqc2t',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  secure: true,
  host: 'cdn.contentful.com',
  resolveLinks: true,
})

function fetchContent(cb) {
  client.entry('21iETXyGwMI8GGQ428ciig')
    .then(function(entry) {
      var html = mapValues(entry.fields, function(value) { return marked(value) })
      cb(entry.sys.revision, html)
    }).catch(function (response) {
      console.error(response)
      process.exit(1)
    })
}

module.exports = fetchContent