const express = require('express');
const app = express();

const db = require('./models/db/db');
const { buscarUsuarios, editarUsuario } = require('./models/DAO/usuarioDAO');
const {criaToken} = require('./middlewares/validaToken');

//Configurações
app.set('view engine', 'EJS');
app.set('views', './src/views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORTA = 3000;

//configurando o JWT
const jwt = require('jsonwebtoken');
const SECRET = 'S9sqCYZ6vW84vKQCnwNu629V66L9OV5cNQ0of8R37TIzAzo2eS';

//READ: Listar os usuários
app.get('/', async (req, res) => {
    res.render('index', { usuarios: await buscarUsuarios() });
});

//READ: Listar um usuário específico
app.get('/usuario/:id', verificaPulseiraVIP, async (req, res) => {
    const id = parseInt(req.params.id);
    const usuariosBanco = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    console.log(`Resultado do banco: ${JSON.stringify(usuariosBanco.rows)}`);
    res.render('index', { usuarios: usuariosBanco.rows });
});

//CREATE: Formulário de adição
app.get('/adicionar', verificaPulseiraVIP, (req, res) => {
    res.render('adicionar');
});

//CREATE: Recebe os dados e salva
app.post('/adicionar', verificaPulseiraVIP, async (req, res) => {
    const { nome, email } = req.body;
    const query = 'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *';
    const values = [nome, email];

    try {
        const respostaBanco = await db.query(query, values);
        console.log('Resposta do banco: ', respostaBanco.rows[0]);
    } catch (err) {
        console.error("Erro ao inserir: ", err);
    } finally {
        res.redirect('/');
    }
});

//UPDATE: Formulário de edição
app.get('/editar/:id', verificaPulseiraVIP, async (req, res) => {
    const id = parseInt(req.params.id);
    const linhas = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    const usuario = linhas.rows[0];
    if (!usuario) return res.status(404).send('Usuario não encontrado');
    res.render('editar', { usuario });
});

//UPDATE: Receber os dados e atualizar
app.post('/editar/:id', verificaPulseiraVIP, async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, email } = req.body;

    try {
        const usuario = { id, nome, email };
        await editarUsuario(usuario);
    } catch (err) {
        console.error('Erro ao atualizar: ', err);
    } finally {
        res.redirect('/');
    }
})

//DELETE: Remover o usuário
app.post('/deletar/:id', verificaPulseiraVIP, async (req, res) => {
    const id = parseInt(req.params?.id);
    const query = 'DELETE FROM usuarios WHERE id = $1';
    const values = [id];

    try {
        const respostaBanco = await db.query(query, values);
        console.log('Linhas afetadas', respostaBanco.rowCount);
    } catch (err) {
        console.error('Erro ao remover: ', err);
    } finally {
        res.redirect('/');
    }
})

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    const result = await db.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [email, senha]);

    const usuario = result.rows[0];

    if (!usuario) {
        return res.status(401).send('Acesso negado! Usuário e/ou senha incorretos');
    }

    //criando a pulseira VIP(token JWT)
    const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome }, //payload dados públicos
        SECRET,
        { expiresIn: '1h' } //definindo duração do token
    );

    res.json({ mensagem: 'Logado com sucesso!', token });


})

//Middleware para acessar usando JWT
function verificaPulseiraVIP(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).send('Você não tem a pulseira VIP (Token Ausente)');

    const tokenLimpo = token.split(' ')[1] || token;

    jwt.verify(tokenLimpo, SECRET, (err, decoded) => {
        if (err) return res.status(403).send("Pulseira falsa ou vencida (Token inválido)");

        req.usuario = decoded; //salva os dados do usuário para a rota poder usar

        next();
    });
}

//Middleware
function segurancaDaBalada(req, resp, netx) {
    //1º o segurança olha para a mão do usuário (headers de requisição)
    const token = req.headers['authorization'];

    //2º se o usuário chegou com as mãos abanando (sem token)
    if (!token) {
        return res.status(401).send('<h1>Acesso negado! Cadê sua pulseira, parça!</h1>');
    }

    //3º se ele tem a pulseira, verifica se ela é válida
    // o padrão esperado é 'Bearer <token>'
    if (token === 'Bearer PULSEIRA_VIP_NIVEHELTINHO_2026') {
        netx();
    } else {
        //se a pulseira for de outra festa/ano
        return res.status(403).send('<h1>Acesso negado! Pulseira falsa</h1>');
    }
}

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
})