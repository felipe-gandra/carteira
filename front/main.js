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
      
    document.getElementById("infoAdicional").parentElement.classList.add('card');
    document.getElementById("infoAdicional").parentElement.classList.remove('cardAdicional');
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
  
  gerarGraficoResumo(ativosAtuais, 'graficoResumo');
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

async function visualizarDistribuicao(tipo){
  const ativos = await procuraAtivos(localStorage.getItem("usuarioEmail"));
  
  if (!ativos) {
    alert("Nenhum ativo encontrado.");
    return;
  }

  // Gera o gráfico de pizza com os ativos do tipo selecionado
  if (tipo === 'acoes') {
    gerarGraficoPizza(ativos.acoes, 'infoAdicional');
  } else if (tipo === 'cripto') {
    gerarGraficoPizza(ativos.cripto, 'infoAdicional');
  } else if (tipo === 'fundos') {
    gerarGraficoPizza(ativos.fundos, 'infoAdicional');
  } else {
    alert("Tipo de ativo inválido.");
  }
}


// Gera um grafico de pizza com os ativos passados (pode ser qualquer tipo) e coloca no id passado
function gerarGraficoPizza(ativos, id){
  const local = document.getElementById(id);
  
  // Limpa o conteúdo anterior
  while (local.firstChild) {
    local.removeChild(local.firstChild);
  }

  local.parentElement.classList.add('cardAdicional');
  local.parentElement.classList.remove('card');
  
  // Cria o canvas para o gráfico
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  canvas.id = 'graficoPizza';
  local.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  // Converte objeto de ativos para array se necessário
  let ativosArray = [];
  if (Array.isArray(ativos)) {
    ativosArray = ativos;
  } else {
    // Se for um objeto (como acoes, cripto, fundos), converte para array
    for (let codigo in ativos) {
      ativosArray.push(ativos[codigo]);
    }
  }
  
  // Se não há ativos, mostra mensagem
  if (ativosArray.length === 0) {
    ctx.fillStyle = '#666';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Nenhum ativo desse tipo encontrado', canvas.width/2, canvas.height/2);
    return;
  }
  
  // Extrai os dados para o gráfico
  const dados = ativosArray.map(ativo => {
    const precoAtual = parseFloat(ativo.precoAtual) || 0;
    const quantidade = parseFloat(ativo.quantidade) || 0;
    const valor = precoAtual * quantidade;
    return {
      nome: ativo.nome,
      valor: valor
    };
  });
  
  // Calcula o total
  const total = dados.reduce((sum, item) => sum + item.valor, 0);
  
  // Se o total é 0, mostra mensagem
  if (total === 0) {
    ctx.fillStyle = '#666';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Nenhum valor para exibir', canvas.width/2, canvas.height/2);
    return;
  }
  
  // Cores predefinidas
  const cores = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', 
    '#33FFF5', '#F5FF33', '#FF8C33', '#33FF8C', '#8C33FF',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  // Configurações do gráfico
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 - 30; // -30 para dar espaço para título
  const radius = Math.min(centerX, centerY) - 80; // -80 para margem e legenda
  
  // Desenha o título
  ctx.fillStyle = '#333';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Distribuição dos Ativos', centerX, 25);
  
  // Desenha o gráfico de pizza
  let currentAngle = -Math.PI / 2; // Começa no topo
  
  dados.forEach((item, index) => {
    const sliceAngle = (item.valor / total) * 2 * Math.PI;
    const cor = cores[index % cores.length];
    
    // Desenha a fatia
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = cor;
    ctx.fill();
    
    // Desenha a borda
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Calcula posição para o rótulo (no meio da fatia)
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
    
    // Desenha o rótulo se a fatia for grande o suficiente
    const percentage = ((item.valor / total) * 100);
    if (percentage > 5) { // Só mostra rótulo se for maior que 5%
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${percentage.toFixed(1)}%`, labelX, labelY);
    }
    
    currentAngle += sliceAngle;
  });
  
  // Desenha a legenda
  const legendX = 20;
  let legendY = centerY + radius + 20;
  
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';
  
  dados.forEach((item, index) => {
    const cor = cores[index % cores.length];
    const percentage = ((item.valor / total) * 100).toFixed(1);
    
    // Desenha o quadrado colorido
    ctx.fillStyle = cor;
    ctx.fillRect(legendX, legendY - 10, 15, 15);
    
    // Desenha o texto
    ctx.fillStyle = '#333';
    ctx.fillText(`${item.nome}: US$ ${item.valor.toFixed(2)} (${percentage}%)`, 
                 legendX + 20, legendY + 2);
    
    legendY += 20;
  });
}

// Gera um gráfico de pizza para o resumo financeiro mostrando distribuição por tipo de ativo
function gerarGraficoResumo(ativosAtuais, id) {
  const local = document.getElementById(id);
  
  // Limpa o conteúdo anterior (remove a imagem dummy)
  while (local.firstChild) {
    local.removeChild(local.firstChild);
  }
  
  // Mantém o título
  const titulo = document.createElement('h3');
  titulo.textContent = 'Distribuição dos ativos';
  local.appendChild(titulo);
  
  // Cria o canvas para o gráfico
  const canvas = document.createElement('canvas');
  const containerWidth = local.offsetWidth || 300;
  const canvasSize = Math.min(containerWidth - 20, 280); // Ajusta ao container
  
  canvas.width = canvasSize;
  canvas.height = canvasSize + 80; // +80 para espaço da legenda
  canvas.id = 'graficoResumoCanvas';
  canvas.style.maxWidth = '100%';
  canvas.style.height = 'auto';
  
  local.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  // Calcula valores por tipo de ativo
  const dados = [];
  
  // Calcula valor total de ações
  let valorAcoes = 0;
  for (let codigo in ativosAtuais.acoes) {
    const ativo = ativosAtuais.acoes[codigo];
    valorAcoes += parseFloat(ativo.precoAtual) * parseFloat(ativo.quantidade);
  }
  if (valorAcoes > 0) {
    dados.push({ nome: 'Ações', valor: valorAcoes });
  }
  
  // Calcula valor total de criptos
  let valorCriptos = 0;
  for (let codigo in ativosAtuais.cripto) {
    const ativo = ativosAtuais.cripto[codigo];
    valorCriptos += parseFloat(ativo.precoAtual) * parseFloat(ativo.quantidade);
  }
  if (valorCriptos > 0) {
    dados.push({ nome: 'Criptomoedas', valor: valorCriptos });
  }
  
  // Calcula valor total de fundos
  let valorFundos = 0;
  for (let codigo in ativosAtuais.fundos) {
    const ativo = ativosAtuais.fundos[codigo];
    valorFundos += parseFloat(ativo.precoAtual) * parseFloat(ativo.quantidade);
  }
  if (valorFundos > 0) {
    dados.push({ nome: 'Fundos', valor: valorFundos });
  }
  
  // Se não há dados, mostra mensagem
  if (dados.length === 0) {
    ctx.fillStyle = '#666';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Nenhum ativo encontrado', canvas.width/2, canvas.height/2);
    return;
  }
  
  // Calcula o total
  const total = dados.reduce((sum, item) => sum + item.valor, 0);
  
  // Cores específicas para cada tipo
  const coresFixas = {
    'Ações': '#3357FF',        // Azul
    'Criptomoedas': '#FF5733', // Vermelho/Laranja
    'Fundos': '#33FF57'        // Verde
  };
  
  // Configurações do gráfico (ajustadas para o tamanho menor)
  const centerX = canvas.width / 2;
  const centerY = (canvas.width / 2) + 10; // Centralizado na área do círculo
  const radius = Math.min(centerX, centerY) - 40; // -40 para margem
  
  // Desenha o gráfico de pizza
  let currentAngle = -Math.PI / 2; // Começa no topo
  
  dados.forEach((item, index) => {
    const sliceAngle = (item.valor / total) * 2 * Math.PI;
    const cor = coresFixas[item.nome];
    
    // Desenha a fatia
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = cor;
    ctx.fill();
    
    // Desenha a borda
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Calcula posição para o rótulo (no meio da fatia)
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
    
    // Desenha o rótulo
    const percentage = ((item.valor / total) * 100);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${percentage.toFixed(1)}%`, labelX, labelY);
    
    currentAngle += sliceAngle;
  });
  
  // Desenha a legenda (compacta)
  const legendStartY = centerY + radius + 15;
  let legendY = legendStartY;
  
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  
  dados.forEach((item, index) => {
    const cor = coresFixas[item.nome];
    const percentage = ((item.valor / total) * 100).toFixed(1);
    
    // Desenha o quadrado colorido
    ctx.fillStyle = cor;
    ctx.fillRect(10, legendY - 8, 12, 12);
    
    // Desenha o texto (mais compacto)
    ctx.fillStyle = '#333';
    ctx.fillText(`${item.nome}: ${percentage}%`, 25, legendY + 2);
    
    legendY += 16; // Espaçamento menor
  });
}

async function main(){
  adicionarListenerModal();

  var usuarioLogado = localStorage.getItem("usuarioEmail");

  if (!usuarioLogado || usuarioLogado == null){deslogar(); return;} //se entrou sem estar logado, volta pro login

  const ativos = await procuraAtivos(usuarioLogado);

  //começa ja com algum grafico
  if (ativos.acoes){
    visualizarDistribuicao("acoes");
  }
  else if (ativos.cripto){
    visualizarDistribuicao("cripto");
  }
  else if (ativos.fundos){
    visualizarDistribuicao("fundos");
  }

  atualizaAtivos();
  renderizarAtivos(ativos);
}

main();
