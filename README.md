Brainfuck.js
============

Brainfuck compiler by javascript in both browser &amp; node.js

node.js Usage
-------------
```js
var brainfuck = require('brainfuck')
var source = ',----------[----------------------.,----------]'
var capitalize = brainfuck(source)
console.log(capitalize('abcde\n'))
```
