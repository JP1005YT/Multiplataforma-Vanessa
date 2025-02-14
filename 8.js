const prompt = require('prompt-sync')();
const [base, expoente] = prompt('Digite base e expoente separados por espaço: ').split(' ').map(Number);
console.log('Resultado:', Math.pow(base, expoente));