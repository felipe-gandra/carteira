const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../front')));


const arquivoUsuarios = path.join(__dirname, 'bancoDados', 'registros.json');


// Rota GET para listar todos os usuários
app.get('/usuarios', (req, res) => {
  console.log("Requisição recebida para listar usuários");
  fs.readFile(arquivoUsuarios, (err, data) => {
    if (err) return res.status(500).send("Erro ao ler o arquivo.");
    res.json(JSON.parse(data));
    console.log("Usuários enviados:", JSON.parse(data));

  });
});

// Rota POST para cadastrar um novo usuário
app.post('/usuarios', (req, res) => {
  const novoUsuario = req.body;

  console.log("Novo usuário recebido:", novoUsuario);

  fs.readFile(arquivoUsuarios, (err, data) => {
    if (err) return res.status(500).send("Erro ao ler o arquivo.");

    let usuarios = [];
    try {
      usuarios = JSON.parse(data);
    } catch (e) {}

    // Verifica duplicação
    const emailJaExiste = usuarios.some(u => u.email === novoUsuario.email);
    if (emailJaExiste) {
      return res.status(409).send("Email já cadastrado.");
    }

    usuarios.push(novoUsuario);

    fs.writeFile(arquivoUsuarios, JSON.stringify(usuarios, null, 2), (err) => {
      if (err) return res.status(500).send("Erro ao salvar.");
      res.status(201).send("Usuário cadastrado com sucesso!");
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
