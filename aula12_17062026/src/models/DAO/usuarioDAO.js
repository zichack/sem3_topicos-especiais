const db = require('../db/db');

async function buscarUsuarios(){
    const query = 'SELECT * FROM usuarios';
    const result = await db.query(query);
    return result.rows;
};

async function editarUsuario(usuario){
    const query = 'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3'
    const values = [usuario.nome, usuario.email, usuario.id];
    const result = await db.query(query, values);

    return result.rowCount;
}

module.exports = {buscarUsuarios, editarUsuario}