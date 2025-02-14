const prompt = require('prompt-sync')();
const metros = Number(prompt('Digite o valor em metros: '));
console.log('Centímetros:', metros * 100);