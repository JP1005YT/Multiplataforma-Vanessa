const prompt = require('prompt-sync')();
const raioP = Number(prompt('Digite o raio do círculo: '));
console.log('Perímetro:', 2 * Math.PI * raioP);