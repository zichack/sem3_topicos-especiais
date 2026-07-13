const mysql = require('mysql2/promise');

// Criamos um pool de conexões com o MySQL
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',          // Ajuste se o seu usuário do MySQL for diferente (o padrão é root)
    password: '',          // Coloque a senha do seu MySQL se tiver uma definida
    database: 'aula_node',
    port: 3306             // Porta padrão do MySQL que está na sua foto
});

module.exports = pool;