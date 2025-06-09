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


/**
 * Renderiza os ativos do usuário atualmente logado index.html dentro dos cards
 * @param {} ativosAtuais Lista de ativos do usuário logado
 */
function renderizarAtivos(ativosAtuais){
  const acoes = ativosAtuais.acoes;
  const criptos = ativosAtuais.cripto;
  const fundos = ativosAtuais.fundos;

  const listaAcoes = document.getElementById("listaAcoes");
  const listaCriptos = document.getElementById("listaCriptos");
  const listaFundos = document.getElementById("listaFundos");

  //renderiza os diferentes tipos de ativos no campo de gerenciamento de ativos
  for (let codigo in acoes){
    const li = document.createElement("li");
    const valorAtual = (acoes[codigo].quantidade * acoes[codigo].precoAtual);
    const valorCompra = (acoes[codigo].quantidade * acoes[codigo].precoMedio);
    const variacao = ((valorAtual/valorCompra - 1)*100).toFixed(2);
    var variacaoString = variacao
    if (variacao > 0){variacaoString = "<img src='img/subindo.png' style='height:18px;margin-right:3px'> +" + variacao}
    else if(variacao<0){variacaoString = "<img src='img/diminuindo.png' style='height:18px;margin-right:3px'> " + variacao }

    li.innerHTML = "<p>"+ acoes[codigo].nome +":&nbsp; US$  " + valorAtual.toFixed(2) +"&nbsp (" + variacaoString + " %)</p><button class='botaoEditar' id='"+ acoes[codigo].nome +"'><img src='img/iconeEditar.svg' alt='Editar'></button></li>"

    //adiciona listener no paragrago para chamar a função infoAdicional
    li.querySelector("p").addEventListener("click", () => {
      infoAdicional(codigo, 0);
    });

    const botao = li.querySelector(".botaoEditar");
    botao.addEventListener("click", () => {
      editarAtivo(codigo, acoes, 0);
    });

    listaAcoes.appendChild(li);
  }
  for (let codigo in criptos){
    const li = document.createElement("li");
    const valorAtual = (criptos[codigo].quantidade * criptos[codigo].precoAtual);
    const valorCompra = (criptos[codigo].quantidade * criptos[codigo].precoMedio);
    const variacao = ((valorAtual/valorCompra - 1)*100).toFixed(2);
    var variacaoString = variacao
    if (variacao > 0){variacaoString = "<img src='img/subindo.png' style='height:18px;margin-right:3px'> +" + variacao}
    else if(variacao<0){variacaoString = "<img src='img/diminuindo.png' style='height:18px;margin-right:3px'> " + variacao }

    li.innerHTML = "<p>"+ criptos[codigo].nome +":&nbsp; US$  " + valorAtual.toFixed(2) +"&nbsp (" + variacaoString + " %)</p><button class='botaoEditar' id='"+ criptos[codigo].nome +"'><img src='img/iconeEditar.svg' alt='Editar'></button></li>"

        //adiciona listener no paragrago para chamar a função infoAdicional
    li.querySelector("p").addEventListener("click", () => {
      infoAdicional(codigo, 1);
    });

    const botao = li.querySelector(".botaoEditar");
    botao.addEventListener("click", () => {
    editarAtivo(codigo, criptos, 1);
    });

    listaCriptos.appendChild(li);
  }
  for (let codigo in fundos){
    const li = document.createElement("li");
    const valorAtual = (fundos[codigo].quantidade * fundos[codigo].precoAtual);
    const valorCompra  =(fundos[codigo].quantidade * fundos[codigo].precoMedio);
    const variacao = ((valorAtual/valorCompra - 1)*100).toFixed(2);
    var variacaoString = variacao
    if (variacao > 0){variacaoString = "<img src='img/subindo.png' style='height:18px;margin-right:3px'> +" + variacao}
    else if(variacao<0){variacaoString = "<img src='img/diminuindo.png' style='height:18px;margin-right:3px'> " + variacao }

    li.innerHTML = "<p>"+ fundos[codigo].nome +":&nbsp; US$  " + valorAtual.toFixed(2) +"&nbsp (" + variacaoString + " %)</p><button class='botaoEditar' id='"+ fundos[codigo].nome +"'><img src='img/iconeEditar.svg' alt='Editar'></button></li>"

    //adiciona listener no paragrago para chamar a função infoAdicional
    li.querySelector("p").addEventListener("click", () => {
      infoAdicional(codigo, 2);
    });
    
    const botao = li.querySelector(".botaoEditar");
    botao.addEventListener("click", () => {
      editarAtivo(codigo, fundos, 2);
    });

    listaFundos.appendChild(li)
  }

  renderizaEstatisticas(ativosAtuais);
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
    
    // Verifica se o resultado tem as propriedades esperadas
    if (!resultado.precoAtual || !resultado.precoMedio || !resultado.quantidade) {
      console.error("Dados incompletos:", resultado);
      alert("Dados do ativo incompletos");
      return;
    }
    
    document.getElementById("infoAdicional").innerHTML = `
      <h3>Informações adicionais sobre ${codigo}</h3>
      <p>Preço atual no mercado: US$ ${(resultado.precoAtual)}</p>
      <p>Preço médio de compra: US$ ${(resultado.precoMedio)}</p>
      <p>Quantidade de ativos: ${resultado.quantidade}</p>`;
      
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao buscar informações do ativo");
  }
}

function renderizaEstatisticas(ativosAtuais){
  const acoes = ativosAtuais.acoes;
  const criptos = ativosAtuais.cripto;
  const fundos = ativosAtuais.fundos;

  const listaAcoes = document.getElementById("listaAcoes");
  const listaCriptos = document.getElementById("listaCriptos");
  const listaFundos = document.getElementById("listaFundos");

  investido = [0, 0, 0];
  montante = [0,0,0]


  for (let codigo in acoes){
    investido[0]+=acoes[codigo].precoMedio * acoes[codigo].quantidade;
    montante[0]+=acoes[codigo].precoAtual * acoes[codigo].quantidade;
  }
  for (let codigo in criptos){
    investido[1]+=criptos[codigo].precoMedio * criptos[codigo].quantidade;
    montante[1]+=criptos[codigo].precoAtual * criptos[codigo].quantidade;
  }
  for (let codigo in fundos){
    investido[2]+=fundos[codigo].precoMedio * fundos[codigo].quantidade;
    montante[2]+=fundos[codigo].precoAtual * fundos[codigo].quantidade;
  }

  const totalInvestido = investido[0] + investido[1] + investido[2];
  const totalmontante = montante[0] + montante[1] + montante[2];
  const valorizacao = ((totalmontante/totalInvestido) - 1)*100;
  var ativoPrincipal = null;
  if (montante[0] >= montante[1] && montante[0] >= montante[2]){ativoPrincipal = "Ações";}
  else if (montante[1] >= montante[2]){ativoPrincipal="Criptomoedas";}
  else{ativoPrincipal = "Fundos de investimento";}

  document.getElementById("totalInvestido").innerText = "Total investido:  US$ " + totalInvestido.toFixed(2);
  document.getElementById("montante").innerText = "Montante atual:  US$ " + totalmontante.toFixed(2);
  document.getElementById("valorizacao").innerText = "Valorização:  " + valorizacao.toFixed(2) + "%"
  document.getElementById("lucro").innerText = "Lucro/Prejuízo:  US$ " + (totalmontante - totalInvestido).toFixed(2);
  document.getElementById("principal").innerText = "Tipo de ativo predominante: " + ativoPrincipal;
  
}




function editarAtivo(codigo, ativos, ctipo){
  ativoEmEdicao = codigo;
  tipoEmEdicao = ctipo;

  // Mostra o modal
  document.getElementById("fundoModalEditar").style.display = 'block';
  document.getElementById("modalEditar").style.display = 'block';
  document.getElementById("tituloEditar").innerText= "Editar ativo: " + codigo;


  //cuida dos botões
  document.getElementById("botaoEditarAtivo").onclick = () => {
    if (ativoEmEdicao != null && tipoEmEdicao != null) {
      realizarEdicao(ativoEmEdicao, tipoEmEdicao, false);
    }
  };

  document.getElementById("botaoRemoverAtivo").onclick = () => {
    if (ativoEmEdicao != null && tipoEmEdicao != null) {
      realizarEdicao(ativoEmEdicao, tipoEmEdicao, true);
    }
  };

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


/**
 * Remove o email do usuário logado do localStorage e direciona pro login
 */
function deslogar(){
  localStorage.removeItem("usuarioEmail");
  window.location.href = "login.html";
}


function adicionarListenerModal(){
  document.getElementById("fundoModal").addEventListener("click", function(event){
    const modal = document.getElementById("conteudoModal");
    if (!modal.contains(event.target)){ //se clicar fora do modal, fecha
      fecharModalAddAtivo();
    }
  })
  document.getElementById("fundoModalEditar").addEventListener("click", function(event){
    const modal = document.getElementById("modalEditar");
    if (!modal.contains(event.target)){ //se clicar fora do modal, fecha
      document.getElementById("fundoModalEditar").style.display = 'none';
      document.getElementById("modalEditar").style.display = 'none';
    }
  })

}

function mostrarModalAddAtivo(){
  document.getElementById("fundoModal").style.display = 'block';
  document.getElementById("conteudoModal").style.display = 'block';
}

function fecharModalAddAtivo(){
  document.getElementById("fundoModal").style.display = 'none';
  document.getElementById("conteudoModal").style.display = 'none';
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

  const existe = await ativoExiste(codigo); //ve se a ação existe na bolsa
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

function limpaFormulario(){
  document.getElementById("nomeAtivo").value = '';
  document.getElementById("valorCompra").value = '';
  document.getElementById("unidadesCompradas").value = '';
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

async function main(){
  adicionarListenerModal();

  var usuarioLogado = localStorage.getItem("usuarioEmail");

  if (!usuarioLogado || usuarioLogado == null){deslogar(); return;} //se entrou sem estar logado, volta pro login

  const ativos = await procuraAtivos(usuarioLogado);
  atualizaAtivos();
  renderizarAtivos(ativos);
}

main();
