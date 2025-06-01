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
    if (variacao > 0){variacaoString = "<img src='img/subindo.png' style='height:18px;margin-right:3px'> " + variacao}
    else if(variacao<0){variacaoString = "<img src='img/diminuindo.png' style='height:18px;margin-right:3px'> " + variacao }

    li.innerHTML = "<p>"+ acoes[codigo].nome +":&nbsp;&nbsp;&nbsp&nbsp; R$  " + valorAtual.toFixed(2) +"&nbsp (" + variacaoString + " %)</p><button class='botaoEditar' id='"+ acoes[codigo].nome +"'><img src='img/iconeEditar.svg' alt='Editar'></button></li>"

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
    if (variacao > 0){variacaoString = "<img src='img/subindo.png' style='height:18px;margin-right:3px'> " + variacao}
    else if(variacao<0){variacaoString = "<img src='img/diminuindo.png' style='height:18px;margin-right:3px'> " + variacao }

    li.innerHTML = "<p>"+ criptos[codigo].nome +":&nbsp;&nbsp;&nbsp&nbsp; R$  " + valorAtual.toFixed(2) +"&nbsp (" + variacaoString + " %)</p><button class='botaoEditar' id='"+ criptos[codigo].nome +"'><img src='img/iconeEditar.svg' alt='Editar'></button></li>"

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
    if (variacao > 0){variacaoString = "<img src='img/subindo.png' style='height:18px;margin-right:3px'> " + variacao}
    else if(variacao<0){variacaoString = "<img src='img/diminuindo.png' style='height:18px;margin-right:3px'> " + variacao }

    li.innerHTML = "<p>"+ fundos[codigo].nome +":&nbsp;&nbsp;&nbsp&nbsp; R$  " + valorAtual.toFixed(2) +"&nbsp (" + variacaoString + " %)</p><button class='botaoEditar' id='"+ fundos[codigo].nome +"'><img src='img/iconeEditar.svg' alt='Editar'></button></li>"

    const botao = li.querySelector(".botaoEditar");
    botao.addEventListener("click", () => {
      editarAtivo(codigo, fundos, 2);
    });

    listaFundos.appendChild(li)
  }

  renderizaEstatisticas(ativosAtuais);
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

  document.getElementById("totalInvestido").innerText = "Total investido:  R$ " + totalInvestido.toFixed(2);
  document.getElementById("montante").innerText = "Montante atual:  R$ " + totalmontante.toFixed(2);
  document.getElementById("valorizacao").innerText = "Valorização:  " + valorizacao.toFixed(2) + "%"
  document.getElementById("principal").innerText = "Principal ativo da carteira: " + ativoPrincipal;
  
}


/**
 * 
 * @param {Código do ativo. Ex: PETR4} codigo 
 * @param {Lista de ativos de um tipo específico} ativos 
 * @param {0: Ações, 1: Cripto, 2: Fundos} tipo 
 */
function editarAtivo(codigo, ativos, tipo){
  // Ativa o modal
  document.getElementById("fundoModalEditar").style.display = 'block';
  document.getElementById("modalEditar").style.display = 'block';


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

  //limpa os campos do forms depois de enviado
  limpaFormulario();

  if (!ativoExiste(codigo) || valorCompra <= 0 || unidadesCompradas <= 0 || !tipo){
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

function ativoExiste(codigo){
  return true;
}

async function main(){
  adicionarListenerModal();

  var usuarioLogado = localStorage.getItem("usuarioEmail");

  if (!usuarioLogado || usuarioLogado == null){deslogar(); return;} //se entrou sem estar logado, volta pro login

  const ativos = await procuraAtivos(usuarioLogado);
  renderizarAtivos(ativos);
}

main();
