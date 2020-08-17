const axios = require('axios')

const url = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%2708-17-2020%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao'

const getCotacaoAPI = (data) => axios.get(url)
const extractCotacao = res => res.data.value[0].cotacaoVenda

const getCotacao = async () => {
  const res = await getCotacaoAPI('')
  const cotacao = extractCotacao(res)

  return cotacao
}

module.exports = {
  getCotacaoAPI,
  extractCotacao,
  getCotacao
}