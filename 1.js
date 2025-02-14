const prompt = require('prompt-sync')();
const [n1, n2, n3] = prompt('Digite três notas separadas por espaço: ').split(' ').map(Number);
console.log('Média:', (n1 + n2 + n3) / 3);