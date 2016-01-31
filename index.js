var Metalsmith = require('metalsmith')
var partial = require('metalsmith-partial')
var layouts = require('metalsmith-layouts')
var inPlace = require('metalsmith-in-place')

var less  = require('metalsmith-less')
var permalinks  = require('metalsmith-permalinks')
var cleanCSS = require('metalsmith-clean-css')
var fingerprint = require('metalsmith-fingerprint-ignore')
var define = require('metalsmith-define')
var branch = require('metalsmith-branch')
var mapsite = require('metalsmith-mapsite')
var content = require('./content')

var production = (process.env.NODE_ENV || 'dev') === 'production'
var assetsPath = production ? '/' : '/build/'

var GOOGLE_VERIFICATION_FILE = 'googlee7604517913b481f.html'

var gaTrackerId = production ? 'UA-71560905-1' : ''

var notForGoogle = function(filename) {
  return filename !== GOOGLE_VERIFICATION_FILE
}


content(function(revision, contentFields) {
  Metalsmith(__dirname)
    .concurrency(50)
    .use(define({
      production: true,
      assetsPath: assetsPath,
      gaTrackerId: gaTrackerId,
      content: contentFields
    }))
    .use(less({pattern: 'styles/main.less'}))
    .use(cleanCSS({
      files: 'styles/main.css',
      cleanCSS: {
        rebase: true
      }
    }))
    .use(fingerprint({ pattern: ['styles/main.css'] }))
    .use(inPlace({
      engine: 'handlebars',
      partials: './templates'
    }))
    .use(layouts({
      directory: './templates',
      partials: './templates', 
      engine: 'handlebars'
    }))
    .use(branch(notForGoogle).use(permalinks({
      relative: false
    })))
    .use(mapsite({
      hostname: 'http://www.ravintolavinkel.fi',
      changefreq: 'daily',
      pattern: ['**/*.html', '!'+GOOGLE_VERIFICATION_FILE, '!webmail/*'],
      omitIndex: true
    }))
    .destination('./build')
    .build(function (err) { if(err) console.log(err) })

})

