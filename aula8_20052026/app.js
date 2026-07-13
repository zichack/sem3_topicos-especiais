//importando o pacote express
const express = require("express");
//instanciando/inicializando o express
const app = express();
const port = 3000;

//middleware para processar o corpo da requisição
app.use(express.urlencoded({extended: true})); //para interpretar dados de formulários
app.use(express.json()); //para interpretar dados em formato JSON


//rotas da aplicação
app.get('/', (req, res) =>{
    console.log("Requisição tipo GET realizada na rota /");
    res.send("<h1>Bem vindo ao sistema XPTO!</h1>");
});

app.get("/cadastrocliente", (req, res) =>{
    console.log("Requisição tipo GET na rota /cadastrocliente");
    res.send("<h1>Cadastro de clientes</h1>");
});

app.get('/buscar', (req, res) =>{
    const termoDeBusca = req.query.termo;
    if(termoDeBusca){
        console.log("Parâmetro via query: " + termoDeBusca);
        res.send(`<h1>Você pesquisou por ${termoDeBusca}</h1>`);
    }
});

app.post('/recebeform', (req, res) =>{
    const dados = req.body;
    console.log("Dados vindo do formulário: ", dados);
    res.send("<h1>Formulário recebido com sucesso!</h1>");
});

app.post("/login", (req, res) => {
    const { login, senha } = req.body;
    console.log("Login: " + login);
    console.log("Senha: " + senha);

    if (login === 'alex' && senha === '1234') {
        res.status(202).send("<h1>Login bem sucedido!</h1></br><h4>Alex, o que vamos fazer hoje?</h4>");
    } else {
        res.status(401).send("<h1>Login falhou! Verifique suas credenciais.</h1>");
    }
});

//Iniciando o servidor na porta 3000
app.listen(port, () =>{
    console.log(`Servidor rodando na porta ${port}`);
})

app.post('/cadastraproduto', (req, res) =>{
    const {codigo, nome, preco} = req.body;
    if(codigo && nome && preco){
        res.status(202).send(`<h1>Produto inserido!</h1><p>Código: ${codigo}</p><p>Nome: ${nome}</p><p>Preço: R$${preco}</p>`);
    } else {
        res.status(400).send("<h1>Dados incompletos! Verifique as informações do produto.</h1>");
    }
});

app.put('/editaonibus', (req, res) =>{
    const {numero, linha, lugares} = req.body;
    if(numero && linha && lugares){
        res.status(200).send(`<h1>Busão alterado!</h1><p>Numero: ${numero}</p><p>Linha: ${linha}</p><p>Lugares: ${lugares}</p>`);
    }else{
        res.status(400).send("<h1>Faltou algum parâmetro!</h1>");
    }
});