var Handlebars = require('handlebars')
var find = require('lodash.find')

module.exports = function langlink(locale, block) {
  var altFile = block.data.root.altFiles[locale]
  if (locale === 'fi') {
    var path = '/' + (altFile && altFile.slug ? altFile.slug + '/' : '')
    return path
  }
  var path = '/' + (altFile && altFile.locale ? altFile.locale + '/': '') + (altFile && altFile.slug ? altFile.slug + '/' : '')
  return path
}