var Metalsmith = require('metalsmith')
var markdown = require('metalsmith-markdown')
var templates  = require('metalsmith-templates')
var less  = require('metalsmith-less')
var permalinks  = require('metalsmith-permalinks')
var cleanCSS = require('metalsmith-clean-css')
var fingerprint = require('metalsmith-fingerprint-ignore')
var define = require('metalsmith-define')

var production = (process.env || 'dev') === 'production'
var assetsPath = production ? '' : '/build/'

Metalsmith(__dirname)
  .concurrency(50)
  .use(define({
    production: true,
    assetsPath: assetsPath
  }))
  .use(markdown())
  .use(less({pattern: 'styles/main.less'}))
  .use(cleanCSS({
    files: 'styles/main.css',
    cleanCSS: {
      rebase: true
    }
  }))
  .use(fingerprint({ pattern: ['styles/main.css'] }))
  .use(templates('handlebars'))
  .use(permalinks({
    pattern: ':title',
    relative: false
  }))
  .destination('./build')
  .build(function (err) { if(err) console.log(err) })