const prompt = require('prompt-sync')();
const fahrenheit = Number(prompt('Digite a temperatura em Fahrenheit: '));
console.log('Celsius:', (fahrenheit - 32) * 5/9);
