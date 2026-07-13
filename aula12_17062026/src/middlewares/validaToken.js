function criaToken(usuario){

//criando a pulseira VIP(token JWT)
    const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome }, //payload dados públicos
        SECRET,
        { expiresIn: '1h' } //definindo duração do token
    );
    return token;
}

module.exports = {criaToken}