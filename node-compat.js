// Restores util helpers removed in modern Node (23+) that old dependencies still use.
var util = require('util')

var shims = {
  isArray: Array.isArray,
  isBoolean: function(a) { return typeof a === 'boolean' },
  isNull: function(a) { return a === null },
  isNullOrUndefined: function(a) { return a == null },
  isNumber: function(a) { return typeof a === 'number' },
  isString: function(a) { return typeof a === 'string' },
  isSymbol: function(a) { return typeof a === 'symbol' },
  isUndefined: function(a) { return a === undefined },
  isRegExp: function(a) { return util.types.isRegExp(a) },
  isObject: function(a) { return a !== null && typeof a === 'object' },
  isDate: function(a) { return util.types.isDate(a) },
  isError: function(a) { return util.types.isNativeError(a) || a instanceof Error },
  isFunction: function(a) { return typeof a === 'function' },
  isPrimitive: function(a) { return a === null || (typeof a !== 'object' && typeof a !== 'function') },
  isBuffer: function(a) { return Buffer.isBuffer(a) },
  _extend: function(target, source) {
    if (source === null || typeof source !== 'object') return target
    Object.keys(source).forEach(function(k) { target[k] = source[k] })
    return target
  },
  print: function() { process.stdout.write(Array.prototype.join.call(arguments, '')) },
  puts: function() { process.stdout.write(Array.prototype.join.call(arguments, '\n') + '\n') },
}

Object.keys(shims).forEach(function(name) {
  if (typeof util[name] !== 'function') util[name] = shims[name]
})
