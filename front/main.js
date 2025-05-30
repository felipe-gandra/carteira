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

  console.log(acoes);

  const listaAcoes = document.getElementById("listaAcoes");
  const listaCriptos = document.getElementById("listaCriptos");
  const listaFundos = document.getElementById("listaFundos");

  //renderiza os diferentes tipos de ativos
  for (let codigo in acoes){
    const li = document.createElement("li");
    li.innerHTML = "<p>"+ acoes[codigo].nome +":&nbsp;&nbsp;&nbsp&nbsp; R$  " + (acoes[codigo].quantidade * acoes[codigo].precoAtual).toFixed(2) +"</p><button class='botaoEditar' id='"+ acoes[codigo].nome +"'><img src='assets/iconeEditar.svg' alt='Editar'></button></li>"

    const botao = li.querySelector(".botaoEditar");
    botao.addEventListener("click", () => {
      editarAtivo(codigo, acoes, 0);
    });

    listaAcoes.appendChild(li);
  }
  for (let codigo in criptos){
    const li = document.createElement("li");
    li.innerHTML = "<p>"+ criptos[codigo].nome +":&nbsp;&nbsp;&nbsp&nbsp; R$  " + (criptos[codigo].quantidade * criptos[codigo].precoAtual).toFixed(2) +"</p><button class='botaoEditar' id='"+ criptos[codigo].nome +"'><img src='assets/iconeEditar.svg' alt='Editar'></button></li>"

    const botao = li.querySelector(".botaoEditar");
    botao.addEventListener("click", () => {
    editarAtivo(codigo, criptos, 1);
    });

    listaCriptos.appendChild(li);
  }
  for (let codigo in fundos){
    const li = document.createElement("li");
    li.innerHTML = "<p>"+ fundos[codigo].nome +":&nbsp;&nbsp;&nbsp&nbsp; R$  " + fundos[codigo].valorAtual +"</p><button class='botaoEditar' id='"+ fundos[codigo].nome +"'><img src='assets/iconeEditar.svg' alt='Editar'></button></li>"

    const botao = li.querySelector(".botaoEditar");
    botao.addEventListener("click", () => {
      editarAtivo(codigo, fundos, 2);
    });

    listaFundos.appendChild(li)
  }
}

/**
 * 
 * @param {Código do ativo. Ex: PETR4} codigo 
 * @param {Lista de ativos de um tipo específico} ativos 
 * @param {0: Ações, 1: Cripto, 2: Fundos} tipo 
 */
function editarAtivo(codigo, ativos, tipo){
  if (tipo === 0){
    alert("tentou editar acao " + ativos[codigo].nome);
  }
  else if (tipo == 1){
    alert("tentou editar a cripto " + ativos[codigo].nome);
  }
  else{
    alert("tentou editar o fundo " + ativos[codigo].nome);
  }
}

/**
 * Remove o email do usuário logado do localStorage e direciona pro login
 */
function deslogar(){
  localStorage.removeItem("usuarioEmail");
  window.location.href = "login.html";
}

async function main(){
  var usuarioLogado = localStorage.getItem("usuarioEmail");
  console.log(usuarioLogado);
  if (!usuarioLogado || usuarioLogado == null){deslogar(); return;} //se entrou sem estar logado, volta pro login

  const ativos = await procuraAtivos(usuarioLogado);
  renderizarAtivos(ativos);
}


main();
