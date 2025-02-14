const prompt = require('prompt-sync')();

const capital = Number(prompt('Digite o capital inicial: '));
const taxa = Number(prompt('Digite a taxa de juros (decimal): '));
const periodo = Number(prompt('Digite o período: '));

console.log('Montante com Juros Compostos:', capital * Math.pow((1 + taxa), periodo));
