// Funções relacionadas às requisições HTTP e comunicação com o servidor

/**
 * Faz uma requisição de uma lista com os usuários presentes no banco de dados
 * @returns Lista de usuários caso funcione, ou null em caso de erro
 */
async function getUsuarios(){
  try{
    const resposta = await fetch("http://localhost:3000/usuarios");
    const usuarios = await resposta.json()

    return usuarios;
  }
  catch(erro){
    alert("Erro ao acessar o banco de dados");
    return null;
  }
}

/**
 * Procura os ativos de um determinado email no banco de dados
 * @param {email com os ativos associados} email 
 * @returns Lista de ativos caso encontre, ou null
 */
async function procuraAtivos(email){
  const usuarios = await getUsuarios();
  
  for (let u of usuarios){
    if (u.email == email){
      return u.ativos;
    }
  }
  return null;
}

async function ativoExiste(codigo) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        codigo: codigo
      })
    };

    const resposta = await fetch("http://localhost:3000/verificarAtivo", options);
    const resultado = await resposta.text();

    console.log("Resultado: " + resultado);
  
    if (resultado === "false" || !resultado) {
      return false;
    } else {
      return true;
    }
  } catch (erro) {
    console.error("Erro ao verificar ativo:", erro);
    alert("Erro de rede ao verificar ativo: " + erro.message);
    return false;
  }
}

async function atualizaAtivos(){
  const options = {
    method:'POST',
    headers:{
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      email : localStorage.getItem("usuarioEmail"),
    })
  }
  //coloquei para somente atualizar do usuario logado. ISso deve ajudar no processamento e evita 
  // sobrecarregar a api, que já é limitada por ser gratuita
  const resultado = await fetch("http://localhost:3000/usuarios/atualizarAtivos", options)
}

async function adicionarAtivo(event){
  event.preventDefault();

  var tipo = null;
  if (document.getElementById("acao").checked){ var tipo = "acoes";}
  else if (document.getElementById("cripto").checked){ var tipo = "cripto";}
  else{ var tipo = "fundos";}

  const codigo = document.getElementById("nomeAtivo").value;
  const valorCompra = document.getElementById("valorCompra").value;
  const unidadesCompradas = document.getElementById("unidadesCompradas").value;

  const existe = await ativoExiste(codigo);
  if (!existe){
    alert("Ativo não encontrado na bolsa NASDAQ");
    return;
  }

  //limpa os campos do forms depois de enviado
  limpaFormulario();

  if (valorCompra <= 0 || unidadesCompradas <= 0 || !tipo){
    alert("Dados inválidos!");
    return;
  }

  fecharModalAddAtivo();

  //cria a estrutura do objeto que sera salvo no banco
  novoAtivo = {[codigo] : {
    nome : codigo,
    quantidade : unidadesCompradas,
    precoMedio : valorCompra,
    precoAtual : valorCompra
  }}

  console.log(novoAtivo);
  console.log(tipo);

  const options = {
    method:'POST',
    headers:{
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      email : localStorage.getItem("usuarioEmail"),
      novoAtivo: novoAtivo,
      tipo : tipo
    })
  };
  
  const resposta = await fetch("http://localhost:3000/usuarios/addAtivo", options);
  const resultado = await resposta.text();
  location.reload();
}

async function realizarEdicao(codigo, ctipo, remocao){
  //pega os valores do formulario
  const novoValor = document.getElementById("novoValor").value;
  const novoUnidades = document.getElementById("novoValorUnidades").value;

  //faz uma validacao pra ver se o usuario realmente inseriu alguma coisa
  if ((!novoValor || !novoUnidades) && !remocao){
    alert("Por favor, preencha todos os campos para editar.");
    return;
  }

  //define o tipó de ativo que ta senod editado
  var tipo = null;
  if (ctipo == 0){tipo = "acoes";}
  else if (ctipo == 1){tipo = "cripto";}
  else{tipo = "fundos";}

  const alteracoes = {
    nome : codigo,
    quantidade : parseFloat(novoUnidades),
    precoMedio : parseFloat(novoValor),
    precoAtual : parseFloat(novoValor)
  }

  const options = {
    method:'POST',
    headers:{
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      email : localStorage.getItem("usuarioEmail"),
      alteracoes : alteracoes,
      tipo : tipo,
      remocao : remocao
    })
  }

  try {
    const resultado = await fetch("http://localhost:3000/usuarios/editarAtivo", options);
    
    if (!resultado.ok) {
      const errorText = await resultado.text();
      console.error('Server error:', errorText);
      alert("Erro no servidor: " + errorText);
      return;
    }
    
    const resposta = await resultado.text();
    
    // fecha o modal
    document.getElementById("fundoModalEditar").style.display = 'none';
    document.getElementById("modalEditar").style.display = 'none';
    
    //limpa
    document.getElementById("novoValor").value = '';
    document.getElementById("novoValorUnidades").value = '';
    
    //att pagina
    location.reload();
    
  } catch (error) {
    alert("Erro de rede: " + error.message);
  }
}

async function infoAdicional(codigo, tipo){
  //faz uma requisição para pegar as informações adicionais do ativo
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      codigo: codigo,
      tipo: tipo,
      email: localStorage.getItem("usuarioEmail") // Adiciona o email do usuário
    })
  };
  try {
    const resposta = await fetch("http://localhost:3000/infoAdicional", options);
    
    // Verifica se a resposta foi bem-sucedida
    if (!resposta.ok) {
      const errorText = await resposta.text();
      console.error("Erro do servidor:", errorText);
      alert("Erro ao buscar informações do ativo: " + errorText);
      return;
    }
    
    const resultado = await resposta.json();
    
    console.log("Resultado:", resultado); // Para debug
    
    // Converte para números para garantir que são números
    const precoAtual = parseFloat(resultado.precoAtual);
    const precoMedio = parseFloat(resultado.precoMedio);
    const quantidade = parseFloat(resultado.quantidade);
    
    // Verifica se os valores são válidos
    if (isNaN(precoAtual) || isNaN(precoMedio) || isNaN(quantidade)) {
      console.error("Dados inválidos:", resultado);
      alert("Dados do ativo inválidos");
      return;
    }
    
    document.getElementById("infoAdicional").innerHTML = `
      <h3>Informações adicionais sobre ${codigo}</h3>
      <p>Preço atual: US$ ${precoAtual.toFixed(2)}</p>
      <p>Preço médio: US$ ${precoMedio.toFixed(2)}</p>
      <p>Quantidade: ${quantidade}</p>`;
      
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao buscar informações do ativo");
  }
}
