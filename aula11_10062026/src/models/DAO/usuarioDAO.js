const db = require('../db/db');

async function buscarUsuarios(){
    const query = 'SELECT * FROM usuarios';
    const result = await db.query(query);
    return result.rows;
}

module.exports = {buscarUsuarios}