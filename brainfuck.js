(function () {
  var MEMORY_LENGTH = 256
  var UNIT_LENGTH = 256

  var aryProto = Array.prototype

  function pass() {}

  function isUndef(x) {
    return typeof x === 'undefined'
  }

  function Memory(input) {
    input = input || ''
    this.ptr = 0
    this.input = aryProto.slice.call(input)
    this.output = []
  }

  var symbolFunc = {
    '<': function () {
      this.ptr = (this.ptr - 1) % MEMORY_LENGTH
    },
    '>': function () {
      this.ptr = (this.ptr + 1) % MEMORY_LENGTH
    },
    '+': function () {
      var value = this[this.ptr]
      if (isUndef(value))
        this[this.ptr] = 1
      else
        this[this.ptr] = (value + 1) % UNIT_LENGTH
    },
    '-': function () {
      var value = this[this.ptr]
      if (isUndef(value))
        this[this.ptr] = -1
      else
        this[this.ptr] = (value - 1) % UNIT_LENGTH
    },
    '.': function () {
      this.output.push(String.fromCharCode(this[this.ptr]))
    },
    ',': function () {
      this[this.ptr] = this.input.shift().charCodeAt(0) % UNIT_LENGTH
    },
    '[': function () {
      return (this[this.ptr] === 0)
    },
    ']': function () {
      return (this[this.ptr] !== 0)
    }
  }

  function calculateLoop(source) {
    var loopStart = []
    var loop = {}

    aryProto.forEach.call(source, function (code, index) {
      if (code === '[') {
        loopStart.push(index)
      } else if (code === ']') {
        var start = loopStart.pop()
        if (isUndef(start)) {
          throw new Error('"[" not found to match "]" at ' + i)
        }
        loop[start] = index
        loop[index] = start
      }
    })

    if (loopStart.length > 0) {
      throw new Error('"]" not found to match "[" at ' + loopStart.join(', '))
    }

    return loop
  }

  function compile(source) {
    var loop = calculateLoop(source)
    var funcs = aryProto.map.call(source, function (code) {
      return symbolFunc[code] || pass
    })
    return function (input) {
      var mem = new Memory(input)
      for (var i = 0, l = funcs.length; i < l; i++) {
        if(funcs[i].call(mem)) {
          i = loop[i]
        }
      }
      return mem.output.join('')
    }
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
