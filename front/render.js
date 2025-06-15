// Funções relacionadas à renderização e exibição de dados na interface

function renderizarAtivos(ativosAtuais){
  // Renderiza as estatísticas do resumo financeiro
  renderizaEstatisticas(ativosAtuais);
  
  // Renderiza as listas de ativos
  renderizarListaAcoes(ativosAtuais.acoes);
  renderizarListaCriptos(ativosAtuais.cripto);
  renderizarListaFundos(ativosAtuais.fundos);
}

function renderizarListaAcoes(acoes) {
  const listaAcoes = document.getElementById("listaAcoes");
  listaAcoes.innerHTML = ''; // Limpa a lista

  for (let codigo in acoes) {
    const li = document.createElement("li");
    const valorAtual = (acoes[codigo].quantidade * acoes[codigo].precoAtual);
    const valorCompra = (acoes[codigo].quantidade * acoes[codigo].precoMedio);
    const variacao = ((valorAtual/valorCompra - 1)*100).toFixed(2);
    var variacaoString = variacao;
    
    if (variacao > 0) {
      variacaoString = "<img src='img/subindo.png' style='height:18px;margin-right:3px'> +" + variacao;
    }
    else if(variacao < 0) {
      variacaoString = "<img src='img/diminuindo.png' style='height:18px;margin-right:3px'> " + variacao;
    }

    li.innerHTML = "<p>"+ acoes[codigo].nome +":&nbsp; US$  " + valorAtual.toFixed(2) +"&nbsp (" + variacaoString + " %)</p><button class='botaoEditar' id='"+ acoes[codigo].nome +"'><img src='img/iconeEditar.svg' alt='Editar'></button></li>";

    // Adiciona listener no parágrafo para chamar a função infoAdicional
    li.querySelector("p").addEventListener("click", () => {
      infoAdicional(codigo, 0);
    });

    const botao = li.querySelector(".botaoEditar");
    botao.addEventListener("click", () => {
      editarAtivo(codigo, acoes, 0);
    });

    listaAcoes.appendChild(li);
  }
}

function renderizarListaCriptos(criptos) {
  const listaCriptos = document.getElementById("listaCriptos");
  listaCriptos.innerHTML = ''; // Limpa a lista

  for (let codigo in criptos) {
    const li = document.createElement("li");
    const valorAtual = (criptos[codigo].quantidade * criptos[codigo].precoAtual);
    const valorCompra = (criptos[codigo].quantidade * criptos[codigo].precoMedio);
    const variacao = ((valorAtual/valorCompra - 1)*100).toFixed(2);
    var variacaoString = variacao;
    
    if (variacao > 0) {
      variacaoString = "<img src='img/subindo.png' style='height:18px;margin-right:3px'> +" + variacao;
    }
    else if(variacao < 0) {
      variacaoString = "<img src='img/diminuindo.png' style='height:18px;margin-right:3px'> " + variacao;
    }

    li.innerHTML = "<p>"+ criptos[codigo].nome +":&nbsp; US$  " + valorAtual.toFixed(2) +"&nbsp (" + variacaoString + " %)</p><button class='botaoEditar' id='"+ criptos[codigo].nome +"'><img src='img/iconeEditar.svg' alt='Editar'></button></li>";

    // Adiciona listener no parágrafo para chamar a função infoAdicional
    li.querySelector("p").addEventListener("click", () => {
      infoAdicional(codigo, 1); // Tipo 1 para criptos
    });

    const botao = li.querySelector(".botaoEditar");
    botao.addEventListener("click", () => {
      editarAtivo(codigo, criptos, 1);
    });

    listaCriptos.appendChild(li);
  }
}

function renderizarListaFundos(fundos) {
  const listaFundos = document.getElementById("listaFundos");
  listaFundos.innerHTML = ''; // Limpa a lista

  for (let codigo in fundos) {
    const li = document.createElement("li");
    const valorAtual = (fundos[codigo].quantidade * fundos[codigo].precoAtual);
    const valorCompra = (fundos[codigo].quantidade * fundos[codigo].precoMedio);
    const variacao = ((valorAtual/valorCompra - 1)*100).toFixed(2);
    var variacaoString = variacao;
    
    if (variacao > 0) {
      variacaoString = "<img src='img/subindo.png' style='height:18px;margin-right:3px'> +" + variacao;
    }
    else if(variacao < 0) {
      variacaoString = "<img src='img/diminuindo.png' style='height:18px;margin-right:3px'> " + variacao;
    }

    li.innerHTML = "<p>"+ fundos[codigo].nome +":&nbsp; US$  " + valorAtual.toFixed(2) +"&nbsp (" + variacaoString + " %)</p><button class='botaoEditar' id='"+ fundos[codigo].nome +"'><img src='img/iconeEditar.svg' alt='Editar'></button></li>";

    // Adiciona listener no parágrafo para chamar a função infoAdicional
    li.querySelector("p").addEventListener("click", () => {
      infoAdicional(codigo, 2); // Tipo 2 para fundos
    });

    const botao = li.querySelector(".botaoEditar");
    botao.addEventListener("click", () => {
      editarAtivo(codigo, fundos, 2);
    });

    listaFundos.appendChild(li);
  }
}
