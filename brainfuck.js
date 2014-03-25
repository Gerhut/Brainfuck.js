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
    left: function () {
      this.ptr = (this.ptr - 1) % MEMORY_LENGTH
    },
    right: function () {
      this.ptr = (this.ptr + 1) % MEMORY_LENGTH
    },
    add: function () {
      var value = this[this.ptr]
      if (isUndef(value))
        this[this.ptr] = 1
      else
        this[this.ptr] = (value + 1) % UNIT_LENGTH
    },
    minus: function () {
      var value = this[this.ptr]
      if (isUndef(value))
        this[this.ptr] = -1
      else
        this[this.ptr] = (value - 1) % UNIT_LENGTH
    },
    write: function () {
      this.output.push(String.fromCharCode(this[this.ptr]))
    },
    read: function () {
      this[this.ptr] = this.input.shift().charCodeAt(0) % UNIT_LENGTH
    },
    notZero: function () {
      return (this[this.ptr] !== 0)
    }
  }

  function compile(source) {
    var header = 'var Memory = this;'
               + 'return function (input) {'
               + 'var mem = new Memory(input);'
    var body = aryProto.map.call(source, function (symbol) {
      switch(symbol) {
        case '<':
          return 'mem.left();'
        case '>':
          return 'mem.right();'
        case '+':
          return 'mem.add();'
        case '-':
          return 'mem.minus();'
        case ',':
          return 'mem.read();'
        case '.':
          return 'mem.write();'
        case '[':
          return 'while (mem.notZero()) {'
        case ']':
          return '}'
        default:
          return ''
      }
    }).join('')
    var footer = 'return mem.output.join("");}'
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