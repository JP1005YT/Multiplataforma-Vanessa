const prompt = require('prompt-sync')();

const preco = Number(prompt('Digite o preço do produto: '));
const percentual = Number(prompt('Digite o percentual de desconto: '));
console.log('Preço com desconto:', preco - (preco * (percentual / 100)));