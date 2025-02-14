const prompt = require('prompt-sync')();
const raio = Number(prompt('Digite o raio do círculo: '));
console.log('Área:', Math.PI * Math.pow(raio, 2));