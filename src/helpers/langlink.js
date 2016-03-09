var Handlebars = require('handlebars')
var find = require('lodash.find')

module.exports = function ifNotLocale(locale, block, ctx) {
  if(block.data.root.locale !== locale) {
    var altFile = block.data.root.altFiles[locale]
    if (locale === 'fi') {
      var path = '/' + (altFile && altFile.slug ? altFile.slug + '/' : '')
      return '<li><a rel="alternate" hreflang="fi" href="' + path + '">fi</a></li>'
    }
    var path = '/' + (altFile && altFile.locale ? altFile.locale + '/': '') + (altFile && altFile.slug ? altFile.slug + '/' : '')
    return '<li><a rel="alternate" hreflang="' + locale + '" href="' + path + '">' + locale + '</a></li>'
  }
}