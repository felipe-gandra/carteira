// Arquivo principal - Inicialização e orquestração das funcionalidades

async function main(){
  adicionarListenerModal();

  var usuarioLogado = localStorage.getItem("usuarioEmail");

  if (!usuarioLogado || usuarioLogado == null){
    deslogar(); 
    return;
  } //se entrou sem estar logado, volta pro login

  const ativos = await procuraAtivos(usuarioLogado);

  //começa ja com algum grafico
  if (ativos.acoes && Object.keys(ativos.acoes).length > 0){
    visualizarDistribuicao("acoes");
  }
  else if (ativos.cripto && Object.keys(ativos.cripto).length > 0){
    visualizarDistribuicao("cripto");
  }
  else if (ativos.fundos && Object.keys(ativos.fundos).length > 0){
    visualizarDistribuicao("fundos");
  }

  atualizaAtivos();
  renderizarAtivos(ativos);
}

main();
