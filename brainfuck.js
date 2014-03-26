(function () {
  var MEMORY_LENGTH = 256
  var UNIT_LENGTH = 256

  var aryProto = Array.prototype

  function isUndef(x) {
    return typeof x === 'undefined'
  }

  function Memory(input) {
    input = input || ''
    this.ptr = 0
    this.input = aryProto.slice.call(input)
    this.output = []
  }

  Memory.prototype = {
    '<': function (n) {
      this.ptr = (this.ptr - n) % MEMORY_LENGTH
    },
    '>': function (n) {
      this.ptr = (this.ptr + n) % MEMORY_LENGTH
    },
    '+': function (n) {
      var value = this[this.ptr]
      if (isUndef(value))
        this[this.ptr] = n
      else
        this[this.ptr] = (value + n) % UNIT_LENGTH
    },
    '-': function (n) {
      var value = this[this.ptr]
      if (isUndef(value))
        this[this.ptr] = -n
      else
        this[this.ptr] = (value - n) % UNIT_LENGTH
    },
    ',': function (n) {
      this[this.ptr] = this.input
                           .splice(0, n)[n - 1].charCodeAt(0) % UNIT_LENGTH
    },
    '.': function (n) {
      var value = String.fromCharCode(this[this.ptr])
      while (n--) {
        this.output.push(value)
      }
    },
    '!0': function () {
      return (this[this.ptr] !== 0)
    },
    // following 2 is used for filter
    '[': null,
    ']': null
  }

  function compile(source) {
    var header = 'var Memory = this;'
               + 'return function (input) {'
               +   'var mem = new Memory(input);'
    var footer =   'return mem.output.join("");'
               + '}'
    var memProto = Memory.prototype
    var body = aryProto.filter.call(source,
      function (symbol) {
        return symbol in memProto
      }).reduceRight(function (merged, symbol) {
        if (typeof memProto[symbol] === 'function') { // not '[' or ']'
          if (merged[0] && merged[0].symbol === symbol) { // same symbol
            merged[0].count += 1
          } else { // not same symbol
            merged.unshift({
              symbol: symbol,
              count: 1
            })
          }
        } else { // '[' or ']'
          merged.unshift(symbol)
        }
        return merged
      }, []).map(function (symbol) {
        if (symbol.count) {
          return 'mem["' + symbol.symbol + '"](' + symbol.count + ');'
        } else if (symbol === '[') {
          return 'while(mem["!0"]()){'
        } else if (symbol === ']') {
          return '}'
        } else {
          return ''
        }
      }).join('')
    return Function(header + body + footer).call(Memory)
  }

  if (typeof module === 'object' && module.exports) { // node.js
    module.exports = compile
  } else {
    if (this.document) {
      this.document.addEventListener('DOMContentLoaded', function () {
        var query = 'script[type="application/brainfuck"][id]'
        var scripts = this.querySelectorAll(query)
        aryProto.forEach.call(scripts, function (script) {
          var id = script.getAttribute('id')
          this[id] = compile(script.innerHTML)
        })
      }, false)
    }
    this.brainfuck = compile
  }
}) ()