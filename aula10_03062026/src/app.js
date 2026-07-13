const express = require('express');
const app = express();

//configurações
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.urlencoded({extended: true}));
const PORT = 3000;

//"Banco de dados" em memória
let usuarios = [
    {id: 1, nome: 'Helton', email: 'hazevedo@up.edu.br'},
    {id: 2, nome: 'Juliana', email: 'juliana@up.edu.br'},
    {id: 3, nome: 'Thiago', email: 'thiago@up.edu.br'},
    {id: 4, nome: 'João', email: 'joao@up.edu.br'}
];

//read: listar os usuários
app.get('/', (req, res) => {
    res.render('index', { usuarios });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

//create: formulário de adição
app.get('/adicionar', (req, res) => {
    res.render('adicionar');
});

//create: recebe os dados e salva
app.post('/adicionar', (req, res) => {
    const { nome, email } = req.body;
    const novoId = usuarios.length > 0 ? usuarios[usuarios.length -1].id + 1 : 1;
    usuarios.push({ id: novoId, nome, email });
    res.redirect('/');
});

//update: formulário de edição
app.get('/editar/:id', (req, res) => {
    const id = req.params.id;
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    res.render('editar', { usuario });
});
