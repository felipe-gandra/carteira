const express = require('express');
const fs = require('fs');
const path = require('path');
const { stringify } = require('querystring');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../front')));

const arquivoUsuarios = path.join(__dirname, 'bancoDados', 'registros.json');

// Rota GET para listar todos os usuários
app.get('/usuarios', (req, res) => {
  fs.readFile(arquivoUsuarios, (err, data) => {
    if (err) return res.status(500).send("Erro ao ler o arquivo.");
    res.json(JSON.parse(data));
  });
});

// Rota POST para cadastrar um novo usuário
app.post('/usuarios', (req, res) => {
  const novoUsuario = req.body; //o body é o json com os dados do usuario

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


//rota para cadastrar um ativo no banco de dados
app.post('/usuarios/addAtivo', (req, res) => {
  const {email, novoAtivo, tipo} = req.body
  const codigoAtivo = Object.keys(novoAtivo)[0];
  var usuarioCerto = null;

  fs.readFile(arquivoUsuarios, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send("Erro ao ler arquivo");
    }

    let usuarios = JSON.parse(data);
    for (let usuario of usuarios){
      if (usuario.email == email){
        usuarioCerto = usuario;
        break;
      }
    }

    if (!usuarioCerto){
      return res.status(404).send("Nao achou usuario"); 
    }
    
    //atualiza os ativos do usuario
    usuarioCerto.ativos[tipo][codigoAtivo] = novoAtivo[codigoAtivo];

    //escreve de volta no banco
    fs.writeFile(arquivoUsuarios, JSON.stringify(usuarios, null, 2), (erro) => {
      if (erro){
        console.error("Erro ao escrever o novo ativo no banco de dados:", erro);
        return res.status(500).send("Erro ao salvar ativo");
      }
      res.send("Funcionou");
    });
  });
});


app.post('/usuarios/editarAtivo', (req, res) => {
  const {email, alteracoes, tipo, remocao} = req.body;
  console.log(alteracoes);
  
  fs.readFile(arquivoUsuarios, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.send("Erro ao ler arquivo");
    }

    let usuarios = JSON.parse(data);
    var usuarioCerto = null;

    for (let usuario of usuarios){
      if (usuario.email == email){
        usuarioCerto = usuario;
        break; //para a busca
      }
    }
    
    if (!usuarioCerto){ //nao deveria acontecer
      return res.send("Erro ao achar usuario para editar ativo");
    }

    //remoção
    if (remocao){
      delete usuarioCerto.ativos[tipo][alteracoes.nome];
    }
    else{
      //edição simples
      usuarioCerto.ativos[tipo][alteracoes.nome] = alteracoes;
    }

    //escreve de volta com as alterções realizadas
    fs.writeFile(arquivoUsuarios, JSON.stringify(usuarios, null, 2), (erro)=>{
      if (erro){
        return res.send("Erro ao escrever no banco para editar ativo");
      }
      res.send("Edição feita!");
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

