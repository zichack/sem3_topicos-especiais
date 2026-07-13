const express = require('express');
const app = express();

const db = require('./models/db/db');

//Configurações
app.set('view engine', 'EJS');
app.set('views', './src/views');
app.use(express.urlencoded({extended: true}));
const PORTA = 3000;

//Nosso "Banco de dados" em memória
let usuarios = [
    {id: 1, nome: 'Helton', email: 'hazevedo@up.edu.br'},
    {id: 2, nome: 'Juliana', email: 'juliana@up.edu.br'},
    {id: 3, nome: 'Thiago', email: 'thiago@up.edu.br'},
    {id: 4, nome: 'João', email: 'joão@up.edu.br'}
];

//READ: Listar os usuários
app.get('/', async (req, res)=>{
    const usuariosBanco = await db.query('SELECT * FROM usuarios');
    console.log(`Resultado do banco: ${JSON.stringify(usuariosBanco.rows)}`);
    res.render('index', {usuarios: usuariosBanco.rows});
});

//READ: Listar um usuário específico
app.get('/usuario/:id', async (req, res)=>{
    const id = parseInt(req.params.id);
    const usuariosBanco = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    console.log(`Resultado do banco: ${JSON.stringify(usuariosBanco.rows)}`);
    res.render('index', {usuarios: usuariosBanco.rows});
});

//CREATE: Formulário de adição
app.get('/adicionar', (req, res)=>{
    res.render('adicionar');
});

//CREATE: Recebe os dados e salva
app.post('/adicionar', async (req, res)=>{
    const { nome, email } = req.body;
    const query = 'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *';
    const values = [nome, email];

    try{
        const respostaBanco = await db.query(query, values);
        console.log('Resposta do banco: ', respostaBanco.rows[0]);
        res.redirect('/');
    }catch (err){
        console.error("Erro ao inserir: ", err);
    }

    /*const novoId = usuarios.length > 0 ? usuarios[usuarios.length -1].id + 1 : 1;
    usuarios.push({id: novoId, nome, email});
    res.redirect('/');*/
});

//UPDATE: Formulário de edição
app.get('/editar/:id', async(req, res)=>{
    const id = parseInt(req.params.id);
    //const usuario = usuarios.find(u => u.id === id);
    const linhas = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    const usuario = linhas.rows[0];
    if(!usuario) return res.status(404).send('Usuario não encontrado');
    res.render('editar', {usuario});
});

//UPDATE: Receber os dados e atualizar
app.post('/editar/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const {nome, email} = req.body;

    const query = 'UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3';
    const values = [nome, email, id];

    try{
        const respostaBanco = await db.query(query, values);
        console.log('Quantidade de linhas alteradas: ', respostaBanco.rowCount);
        res.redirect('/');
    }catch (err){
        console.error('Erro ao atualizar: ', err);
    }

    /*usuarios = usuarios.map(u => 
        u.id === id ? {...u, nome, email } : u
    );
    res.redirect('/');*/
})

//DELETE: Remover o usuário
app.post('/deletar/:id', (req, res) =>{
    const id = parseInt(req.params?.id);
    usuarios = usuarios.filter(u => u.id !== id);
    res.redirect('/');
})

app.listen(PORTA, ()=>{
    console.log(`Servidor rodando na porta ${PORTA}`);
})