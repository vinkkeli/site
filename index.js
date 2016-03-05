var Metalsmith = require('metalsmith')
var layouts = require('metalsmith-layouts')
var inPlace = require('metalsmith-in-place')
var LessPluginAutoPrefix = require('less-plugin-autoprefix')
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

autoprefixPlugin = new LessPluginAutoPrefix({browsers: ["last 2 versions"]})


content(function(revision, contentFields) {
  Metalsmith(__dirname)
    .concurrency(50)
    .use(define({
      production: true,
      assetsPath: assetsPath,
      gaTrackerId: gaTrackerId,
      content: contentFields
    }))
    .use(less({pattern: 'styles/*.less', render: { plugins: [autoprefixPlugin], paths: ['src/styles/'] }}))
    .use(cleanCSS({
      files: 'styles/*.css',
      cleanCSS: {
        rebase: true
      }
    }))
    .use(fingerprint({ pattern: ['styles/*.css'] }))
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

