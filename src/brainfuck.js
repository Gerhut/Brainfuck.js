(function () {
  var MEMORY_LENGTH = 256
  var UNIT_LENGTH = 256

  var aryProto = Array.prototype

  function isUndef(x) {
    return typeof x === 'undefined'
  }

  function Memory(input) {
    this.ptr = 0
    this.input = aryProto.slice.call(input || '')
    this.output = []
  }

  Memory.prototype = {
    l: function (n) { // <
      this.ptr = (this.ptr - n) % MEMORY_LENGTH
    },
    r: function (n) { // >
      this.ptr = (this.ptr + n) % MEMORY_LENGTH
    },
    a: function (n) { // +
      var value = this[this.ptr]
      if (isUndef(value))
        this[this.ptr] = n
      else
        this[this.ptr] = (value + n) % UNIT_LENGTH
    },
    m: function (n) { // -
      var value = this[this.ptr]
      if (isUndef(value))
        this[this.ptr] = -n
      else
        this[this.ptr] = (value - n) % UNIT_LENGTH
    },
    i: function (n) { // ,
      var s = this.input.splice(0, n)
      this[this.ptr] = s[n - 1].charCodeAt(0) % UNIT_LENGTH
    },
    o: function (n) { // .
      var value = String.fromCharCode(this[this.ptr])
      while (n--) {
        this.output.push(value)
      }
    },
    p: function () { // positive, not zero
      return (this[this.ptr] !== 0)
    },
    g: function () { // output
      return this.output.join('')
    }
  }

  var symbleFunc = {
    '<': 'l',
    '>': 'r',
    '+': 'a',
    '-': 'm',
    ',': 'i',
    '.': 'o',
    '[': null,
    ']': null
  }

  function compile(source) {
    var header = 'return function(i){'
               +   'with(new M(i)){'
    var footer =   'return g()'
               +   '}'
               + '}'
    var body = aryProto.filter.call(source,
      function (symbol) {
        return symbol in symbleFunc
      }).reduceRight(function (merged, symbol) {
        if (typeof symbleFunc[symbol] === 'string') { // not '[' or ']'
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
          return symbleFunc[symbol.symbol] + '(' + symbol.count + ');'
        } else if (symbol === '[') {
          return 'while(p()){'
        } else if (symbol === ']') {
          return '}'
        } else {
          return ''
        }
      }).join('')
    return Function('M', header + body + footer)(Memory)
  }

  if (typeof module === 'object' && module.exports) { // node.js
    module.exports = compile
    if (require.main === module) {
      console.log(compile("++++++++++[>+++++++>++++++++++>+++>+<<<<-]"
            + ">++.>+.+++++++..+++.>++.<<+++++++++++++++."
            + ">.+++.------.--------.>+.>.")())
    }
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