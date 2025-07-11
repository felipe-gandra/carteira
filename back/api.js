/*

Funções relacioandas a api de ações

*/
//as criptomoedas tem um codigo diferente do real na api
const criptoMapa = {
    'BTC': 'BINANCE:BTCUSDT',
    'ETH': 'BINANCE:ETHUSDT',
    'ADA': 'BINANCE:ADAUSDT',
    'DOT': 'BINANCE:DOTUSDT',
    'MATIC': 'BINANCE:MATICUSDT',
    'SOL': 'BINANCE:SOLUSDT',
    'AVAX': 'BINANCE:AVAXUSDT',
    'LINK': 'BINANCE:LINKUSDT',
    'UNI': 'BINANCE:UNIUSDT',
    'DOGE': 'BINANCE:DOGEUSDT'
};



const fs = require("fs");
const link = 'https://finnhub.io/api/v1';
const config = JSON.parse(fs.readFileSync("../front/config.json", "utf-8"));


async function buscarPreco(codigo){

  if (codigo in criptoMapa){
    codigo = criptoMapa[codigo];
  }

  //monta o link pra requisição de api
  const endereco = link + "/quote?symbol=" + codigo + "&token=" + config.api_keys.finnhub_api;
  
  //faz o pedido
  const resposta = await fetch(endereco);
  const dados = await resposta.json();
  //console.log(dados);
  return dados.c;
}

async function ativoExiste(codigo) {
  try {
    const resposta = await buscarPreco(codigo);
    console.log(resposta);

    if (resposta != 0){return true}
    return false;
  } catch (erro) {
    console.error(erro);
    return false;
  }
}


module.exports = {buscarPreco, ativoExiste};

