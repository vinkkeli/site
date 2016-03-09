var find = require('lodash.find')
var translations = require('../../translations')
var Handlebars = require('handlebars')

module.exports = function translate(name, ctx) {
  var locale = ctx.data.root.locale === 'se' ? ['se', 'sv'] : [ctx.data.root.locale]
  var content = ctx.data.root.content
  var r = find(content, function(c) { return (locale.indexOf(c.locale) >= 0 || c.locale === undefined)&& c.key === name })
  if (!r) {
    if (translations[name] && translations[name][locale[0]]) {
      return new Handlebars.SafeString(translations[name][locale[0]])
    }
    throw 'Unable to find translations for "' + name + '" in locale: ' + locale
  } else {
    return new Handlebars.SafeString(r.content)
  }
}