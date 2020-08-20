const axios = require('axios')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`

const getCotacaoAPI = url => axios.get(url)
const extractCotacao = res => res.data.value[0].cotacaoVenda

const getToday = () => {
  const today = new Date()
  return (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear()
}

//injeção de dependencias
//QUando chamar a primeira vez, vai passar as dependencias pra essa função, e quando chamar novamente, ai sim vai ta executando a função de verdade
/*
const getCotacao = deps => async () => {
  try {
    //agora essa mudança é pra usar as funções que veio das dependencias
    //poderia fazer const getToday = deps.getToday para todos, ou poderia fazer destruturing assatments que é assim:
  /const {getToday, getUrl, getCotacaoAPI, extractCotacao} = deps
    const today = getToday()
    const url = getUrl(today)
    const res = await getCotacaoAPI(url) //08-17-2020
    const cotacao = extractCotacao(res)

    return cotacao
  } catch (error) {
    return ''
  }
}

Ou pode fazer igual ta aqui abaixo, substituindo pelo nomes deps
*/

const getCotacao = ({getToday, getUrl, getCotacaoAPI, extractCotacao}) => async () => {
  try {
    const today = getToday()
    const url = getUrl(today)
    const res = await getCotacaoAPI(url) //08-17-2020
    const cotacao = extractCotacao(res)

    return cotacao
  } catch (error) {
    return ''
  }
}

module.exports = {
  getCotacaoAPI,
  extractCotacao,

  //ao inves de exportar ele puro, fazemos isso
  //chamamos o getcotacao, passando as dependencias
  getCotacao: getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao }),
  getToday,
  getUrl,
  
  //podemos fazer um outro objeto do getcotacao puro, podemos criar um objeto pure, passando o getcotacao dentro
  pure: {
    getCotacao
  }
}