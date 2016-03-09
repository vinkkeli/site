var contentful = require('contentful')
var marked = require('marked')
var mapValues = require('lodash.mapvalues')
var map = require('lodash.map')
var filter = require('lodash.filter')

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
  client.entries()
    .then(function(entries) {
      var arrays = map(entries, function(entry) {
        var html = mapValues(entry.fields, function(value) { return marked(value) })

        return map(html, function(val, keyWithLocale) {
          if (keyWithLocale.split('_').length == 1) {
            // No locale
            return {locale: undefined, key: keyWithLocale, content: val}
          } else {
            var key = keyWithLocale.substring(0, keyWithLocale.lastIndexOf('_'))
            var locale = keyWithLocale.substring(keyWithLocale.lastIndexOf('_')+1)
            return {locale: locale, key: key, content: val}
          }
          
        })
      })

      var all = []

      for (i=0; i < arrays.length; i ++) {
        all = all.concat(arrays[i])
      }

      var filtered = filter(all, function(v) {
        var withSameKey = filter(all, function(f) { return f.key === v.key})
        return !(v.locale === undefined && withSameKey.length > 1)
      })
      
      cb(filtered)
    }).catch(function (response) {
      console.error(response)
      process.exit(1)
    })
}

module.exports = fetchContent