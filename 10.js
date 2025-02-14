const prompt = require('prompt-sync')();
const km = Number(prompt('Digite o valor em quilômetros: '));
console.log('Milhas:', km * 0.621371);