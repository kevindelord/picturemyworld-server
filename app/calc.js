// /app/calc.js

function sum (array) {  
  return array.reduce(function(a, b) { 
    return a + b
  }, 0)
}

module.exports.sum = sum

// FILE: app/index.js
// const calc = require('./calc')
// const numbersToAdd = [3, 4, 10, 2]
// const result = calc.sum(numbersToAdd)  
// console.log(`The result is: ${result}`)  

