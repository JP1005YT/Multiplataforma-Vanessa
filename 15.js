const prompt = require('prompt-sync')();
const dias = Number(prompt('Digite um valor em dias: '));
const horas = dias * 24;
const minutos = horas * 60;
const segundos = minutos * 60;
console.log(`Horas: ${horas}, Minutos: ${minutos}, Segundos: ${segundos}`);
