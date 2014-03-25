var assert = require('assert')
var brainfuck = require('./brainfuck')

describe('brainfuck.js', function () {
  it('should run "Hello World!" successfully.', function () {
    var source = "++++++++++[>+++++++>++++++++++>+++>+<<<<-]"
               + ">++.>+.+++++++..+++.>++.<<+++++++++++++++."
               + ">.+++.------.--------.>+.>."

    assert.equal(brainfuck(source)(), 'Hello World!\n')
  })
  it('should run capitalize code successfully.', function () {
    var source = ",----------[----------------------.,----------]"
    var input = ''
    do {
      input += String.fromCharCode(Math.random() * 26 + 97)
    } while(Math.random() < 0.9)
    input += '\n'
    assert.equal(brainfuck(source)(input), input.toUpperCase().slice(0, -1))
  })
  it('should run add program successfully.', function () {
    var source = ",>++++++[<-------->-],,[<+>-],<.>."
    var num1 = Math.floor(Math.random() * 10)
    var num2 = Math.floor(Math.random() * (10 - num1))
    var input = num1 + '+' + num2 + '\n'
    assert.equal(brainfuck(source)(input), (num1 + num2).toString() +'\n')
  })
  it('should run multiply program successfully.', function () {
    var source = ",>,,>++++++++[<------<------>>-]"
               + "<<[>[>+>+<<-]>>[<<+>>-]<<<-]"
               + ">>>++++++[<++++++++>-],<.>."
    var num1 = Math.floor(Math.random() * 9 + 1)
    var num2 = Math.floor(Math.random() * (10 / num1))
    var input = num1 + '*' + num2 + '\n'
    assert.equal(brainfuck(source)(input), (num1 * num2).toString() +'\n')
  })
})