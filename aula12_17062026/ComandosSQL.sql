-- CRIANDO A TABELA DE USUÁRIO
CREATE TABLE usuarios(
	id SERIAL PRIMARY KEY,
	nome VARCHAR(200) NOT NULL,
	email VARCHAR(100) NOT NULL
);

-- INSERINDO ALGUNS DADOS INICIAIS
INSERT INTO usuarios(nome, email) VALUES ('Astrogildo', 'gildo@up.edu.br'), ('Neymar', 'ney@up.edu.br');

SELECT * FROM usuarios;