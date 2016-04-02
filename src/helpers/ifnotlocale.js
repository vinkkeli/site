var Handlebars = require('handlebars')

module.exports = function ifNotLocale(locale, block) {
  if(block.data.root.locale !== locale) {
    return block.fn(locale)
  }
}