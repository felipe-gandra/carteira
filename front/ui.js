// Funções relacionadas à interface do usuário, modais e manipulação DOM

// Variáveis globais para controle de edição
var ativoEmEdicao = null;
var tipoEmEdicao = null;

/*
Funções relacioandas aos modais
*/

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

function limpaFormulario(){
  document.getElementById("nomeAtivo").value = '';
  document.getElementById("valorCompra").value = '';
  document.getElementById("unidadesCompradas").value = '';
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
  var valorizacao = ((totalmontante/totalInvestido) - 1)*100;
  var ativoPrincipal = null;
  if (montante[0] >= montante[1] && montante[0] >= montante[2]){ativoPrincipal = "Ações";}
  else if (montante[1] >= montante[2]){ativoPrincipal="Criptomoedas";}
  else{ativoPrincipal = "Fundos de investimento";}
  if (isNaN(valorizacao)){valorizacao = 0.00;}

  document.getElementById("totalInvestido").innerText = "Total investido:  US$ " + totalInvestido.toFixed(2);
  document.getElementById("montante").innerText = "Montante atual:  US$ " + totalmontante.toFixed(2);
  document.getElementById("valorizacao").innerText = "Valorização:  " + valorizacao.toFixed(2) + "%"
  document.getElementById("lucro").innerText = "Lucro/Prejuízo:  US$ " + (totalmontante - totalInvestido).toFixed(2);
  document.getElementById("principal").innerText = "Tipo de ativo predominante: " + ativoPrincipal;

  gerarGraficoResumo(ativosAtuais, 'graficoResumo');
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

// Gera um grafico de pizza com os ativos passados (pode ser qualquer tipo) e coloca no id passado
function gerarGraficoPizza(ativos, id){
  const local = document.getElementById(id);
  
  // Limpa o conteúdo anterior
  while (local.firstChild) {
    local.removeChild(local.firstChild);
  }
  
  // Cria o canvas para o gráfico
  const canvas = document.createElement('canvas');
  
  // Ajusta o tamanho do canvas baseado no container - tamanho menor para caber no card
  const containerWidth = local.offsetWidth || 400;
  const maxSize = 500; 
  const canvasSize = Math.min(containerWidth - 20, maxSize); // -20 para mais padding
  canvas.id = 'graficoPizza';
  canvas.style.maxWidth = '100%';
  canvas.style.height = 'auto';
  
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
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Nenhum ativo encontrado', canvas.width/2, canvas.height/2);
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
  
  // Calcula a altura necessária para a legenda (42px por item + margem)
  const alturaLegenda = dados.length * 42 + 40; // +40 para margem superior e inferior
  
  canvas.width = canvasSize;
  canvas.height = canvasSize + alturaLegenda; // Altura dinâmica baseada no número de itens
  
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
  
  // Configurações do gráfico (ajustadas para tamanho menor e mais compacto)
  const centerX = canvas.width / 2;
  const pizzaAreaHeight = canvas.width; // Área dedicada ao gráfico de pizza
  const centerY = (pizzaAreaHeight / 2) + 10; // Centralizado com pequeno offset
  const radius = Math.min(centerX, centerY) - 60; // -60 para mais margem e espaço para legenda
  
  // Desenha o título (menor)
  ctx.fillStyle = '#333';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Distribuição dos Ativos', centerX, 16);
  
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
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${percentage.toFixed(1)}%`, labelX, labelY);
    }
    
    currentAngle += sliceAngle;
  });
  
  // Desenha a legenda
  const legendStartY = pizzaAreaHeight + 20; // Começa após o gráfico de pizza
  const legendX = 15;
  let legendY = legendStartY;
  
  ctx.font = '20px Arial';
  ctx.textAlign = 'left';
  
  dados.forEach((item, index) => {
    const cor = cores[index % cores.length];
    const percentage = ((item.valor / total) * 100).toFixed(1);
    
    // Desenha o quadrado colorido
    ctx.fillStyle = cor;
    ctx.fillRect(legendX, legendY - 8, 10, 10);
    
    // Desenha o texto (mais compacto)
    ctx.fillStyle = '#333';
    ctx.fillText(`${item.nome}: US$ ${item.valor.toFixed(2)} (${percentage}%)`, 
                 legendX + 14, legendY + 2);
    
    legendY += 30;
  });
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
