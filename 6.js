const prompt = require('prompt-sync')();
const [larguraP, alturaP] = prompt('Digite largura e altura do retângulo separadas por espaço: ').split(' ').map(Number);
console.log('Perímetro:', 2 * (larguraP + alturaP));