/*

Funções relacioandas a api de ações

*/
const fs = require("fs");
const link = 'https://finnhub.io/api/v1';
const config = JSON.parse(fs.readFileSync("../front/config.json", "utf-8"));


async function buscarPreco(codigo){
  //monta o link pra requisição de api
  const endereco = link + "/quote?symbol=" + codigo + "&token=" + config.api_keys.finnhub_api;
  
  //faz o pedido
  const resposta = await fetch(endereco);
  const dados = await resposta.json();
  //console.log(dados);
  return dados.c;
}

async function acaoExiste(codigo) {
  try {
    const resposta = await buscarPreco(codigo);
    console.log(resposta);

    if (resposta.c != 0){return true}
    else{return false;}
  } catch (erro) {
    console.error(erro);
    return false;
  }
}


module.exports = {buscarPreco, acaoExiste};