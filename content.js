var contentful = require('contentful')
var marked = require('marked')
var mapValues = require('lodash.mapvalues')
var map = require('lodash.map')
var filter = require('lodash.filter')
var compact = require('lodash.compact')

marked.setOptions({
  breaks: true,
});

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

function markdownToHtml(value) {
  var markdown = value || ''
  if (markdown.match(/\n/g)) {
    return marked(markdown.normalize('NFC'))
  } else {
    return markdown.normalize('NFC')
  }
}

function entryToTranslation(entry) {
  var html = mapValues(entry.fields, markdownToHtml)

  return map(html, function(val, keyWithLocale) {
    var splitted = keyWithLocale.split('_')
    if (splitted.length == 1  || ['en', 'sv', 'fi'].indexOf(splitted[splitted.length-1]) === -1) {
      // No locale
      return {locale: undefined, key: keyWithLocale, content: val}
    } else {
      var key = keyWithLocale.substring(0, keyWithLocale.lastIndexOf('_'))
      var locale = keyWithLocale.substring(keyWithLocale.lastIndexOf('_')+1)
      return {locale: locale, key: key, content: val}
    }
  })
}

function concatAndFilter(arrays) {
  var all = compact(arrays)
  return filter(all, function(v) {
    var withSameKey = filter(all, function(f) { return f.key === v.key})
    return !(v.locale === undefined && withSameKey.length > 1)
  })
}

function fetchContent(cb) {
  client.entries()
    .then(function(entries) {
      var arrays = map(entries, function(entry) {
        if (entry.sys.contentType.sys.id !== 'speciallunch') {
          return entryToTranslation(entry)
        } else {
          []
        }
      })

      var specials = map(entries, function(entry) {
        if (entry.sys.contentType.sys.id === 'speciallunch') {
          return entryToTranslation(entry)
        } else {
          []
        }
      })

      var content = []
      for (i=0; i < arrays.length; i ++) {
        content = content.concat(compact(arrays[i]))
      }

      cb({content: concatAndFilter(content), specials: compact(specials)})
    }).catch(function (response) {
      console.error(response)
      process.exit(1)
    })
}

module.exports = fetchContent