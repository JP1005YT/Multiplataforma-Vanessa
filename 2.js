const prompt = require('prompt-sync')();
const celsius = Number(prompt('Digite a temperatura em Celsius: '));
console.log('Fahrenheit:', (celsius * 9/5) + 32);