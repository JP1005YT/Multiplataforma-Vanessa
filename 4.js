const prompt = require('prompt-sync')();
const [largura, altura] = prompt('Digite largura e altura do retângulo separadas por espaço: ').split(' ').map(Number);
console.log('Área:', largura * altura);
