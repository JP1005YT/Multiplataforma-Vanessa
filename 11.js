const prompt = require('prompt-sync')();
const peso = Number(prompt('Digite seu peso (kg): '));
const alturaIMC = Number(prompt('Digite sua altura (m): '));
console.log('IMC:', peso / Math.pow(alturaIMC, 2));