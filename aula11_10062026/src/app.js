const express = require('express');
const app = express();

const db = require('./models/db/db');

//Configurações
app.set('view engine', 'EJS');
app.set('views', './src/views');
app.use(express.urlencoded({ extended: true }));
const PORTA = 3000;

//Nosso "Banco de dados" em memória
let usuarios = [
    { id: 1, nome: 'Helton', email: 'hazevedo@up.edu.br' },
    { id: 2, nome: 'Juliana', email: 'juliana@up.edu.br' },
    { id: 3, nome: 'Thiago', email: 'thiago@up.edu.br' },
    { id: 4, nome: 'João', email: 'joão@up.edu.br' }
];

//READ: Listar os usuários
app.get('/', async (req, res) => { // <--- Adicionado o async aqui
    try {
        // O await faz o Node esperar a resposta do MySQL.
        // No mysql2, o resultado vem em um array onde a primeira posição [0] são as linhas.
        const [usuariosBanco] = await db.query('SELECT * FROM usuarios');

        console.log('Resultado do banco:', usuariosBanco);

        // Passa os usuários vindos do banco de dados para renderizar no HTML
        res.render('index', { usuarios: usuariosBanco });
    } catch (error) {
        console.error("Erro ao buscar dados do MySQL:", error);
        res.status(500).send("Erro ao carregar os usuários.");
    }
});

//CREATE: Formulário de adição
app.get('/adicionar', (req, res) => {
    res.render('adicionar');
});

//CREATE: Recebe os dados e salva
app.post('/adicionar', async (req, res) => {    // <--- Alterado de GET '/:id' para POST '/adicionar'
    const { nome, email } = req.body;

    // 2. Ajusta a Query para o padrão do MySQL (usando '?' e sem RETURNING)
    const query = 'INSERT INTO usuarios (nome, email) VALUES (?, ?)';
    const values = [nome, email];

    try {
        // Executa a inserção no banco de dados
        const [resultado] = await db.query(query, values);

        // No mysql2, o resultado traz informações sobre a inserção (como o ID gerado)
        console.log('Usuário inserido com sucesso! ID gerado:', resultado.insertId);

        // Redireciona de volta para a listagem principal
        res.redirect('/');
    } catch (err) {
        console.error("Erro ao inserir no MySQL: ", err);
        res.status(500).send("Erro ao salvar o usuário.");
    }

    /*const { nome, email } = req.body;
    const novoId = usuarios.length > 0 ? usuarios[usuarios.length -1].id + 1 : 1;
    usuarios.push({id: novoId, nome, email});
    res.redirect('/');*/
});

//UPDATE: Formulário de edição
app.get('/editar/:id', async (req, res) => { // <--- Adicionado o async para o await funcionar
    const id = parseInt(req.params.id);
    //const usuario = usuarios.find(u => u.id === id);
    const [linhas] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    const usuario = linhas[0];
    if (!usuario) return res.status(404).send('Usuario não encontrado');
    res.render('editar', { usuario });
});

// O GET /:id veio para cá para não interceptar o /editar/:id e dar o erro de Cannot GET / NaN
app.get('/:id', async (req, res) => {
    try {
        // 1. Captura o id da URL e converte para número
        const id = parseInt(req.params.id);

        // 2. Troca o '$1' por '?' por causa do MySQL
        const [linhasBanco] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);

        // Como o banco retorna um array, pegamos a primeira posição se ela existir
        const usuario = linhasBanco[0];

        if (!usuario) {
            return res.status(404).send('Usuário não encontrado');
        }

        console.log('Usuário encontrado:', usuario);

        // Se a sua intenção for renderizar uma página de detalhes, mude 'index' para a view correta
        // Se for renderizar na index (que usa forEach), passe o resultado dentro de um array: [usuario]
        res.render('index', { usuarios: [usuario] });
    } catch (error) {
        console.error("Erro ao buscar dados do MySQL:", error);
        res.status(500).send("Erro ao carregar o usuário.");
    }
});

//UPDATE: receber os dados e atualizar no MySQL (AJUSTADO APENAS ESSE ITEM)
app.post('/editar/:id', async (req, res) => { // <--- Adicionado async
    try {
        const id = parseInt(req.params.id);
        const { nome, email } = req.body;
        
        console.log('Editando no MySQL... ');
        const query = 'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?';
        await db.query(query, [nome, email, id]);
        
        res.redirect('/');
    } catch (error) {
        console.error("Erro ao atualizar no MySQL:", error);
        res.status(500).send("Erro ao atualizar.");
    }
});

//DELETE: remover o usuário
app.post('/deletar/:id', async (req, res) => { // <--- Adicionado o async aqui
    const id = parseInt(req.params.id); // Limpamos o '?.' opcional que não precisa aqui
    const query = 'DELETE FROM usuarios WHERE id = ?'; // <--- Trocado $1 por ?

    try {
        // Criamos o array contendo o [id] para passar na query
        const [resultado] = await db.query(query, [id]); 
        
        // No mysql2, as linhas afetadas vίνουν dentro de 'affectedRows'
        console.log('Linhas afetadas:', resultado.affectedRows);
    } catch (err) {
        console.error('Erro ao remover: ', err);
    }
    
    // Removido o filtro de memória antigo, mantendo só o redirect original
    res.redirect('/');
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});