var Handlebars = require('handlebars')

module.exports = function ifLocale(locale, block) {
  if(block.data.root.locale === locale) {
    return block.fn(locale)
  }
}