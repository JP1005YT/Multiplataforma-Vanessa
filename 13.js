const prompt = require('prompt-sync')();
const capital = Number(prompt('Digite o capital inicial: '));
const taxa = Number(prompt('Digite a taxa de juros (decimal): '));
const periodo = Number(prompt('Digite o período: '));
console.log('Juros Simples:', capital * taxa * periodo);