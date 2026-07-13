const fs = require('fs');

// Exemplo de código Node.js

const nome = "Helton Azevedo";

console.log("Seja bem vindo: ", nome);

fs.writeFile('aula07-externo.txt', 'utf-8', 'Esse arquivo foi gerado usando o Node.js.', (err, data) => {
    if (err) throw err;
    console.log('Arquivo criado com sucesso.');
});