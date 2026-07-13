// importando pacote http
const http = require('http');

const server = http.createServer((req, res)=>{
    res.setHeader('Content-Type', 'text/html charset=utf-8');

    if(req.url === '/'){
        res.end('<html><head><title>Bem Vindo</title></head><body><h1>Seja bem vindo ao sistema XPTO</h1></body></html>');
    } else if(req.method === 'GET' && req.url === '/cliente'){
        res.end('<h2>Cadastro de clientes</h2>');
    } else{
        res.statusCode = 404;
        res.end('<h1>Página não encontrada</h1>');
    }
});

const PORT = 3000;
server.listen(PORT, 'localhost', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}
)