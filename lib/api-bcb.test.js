const api = require('./api-bcb')

//A gente ta utilizando o axios no api-bcb, e por isso deixa de ser um teste unitario, e passa a ser um teste de integração, pois esta chamando o axios no api-bcb de verdade, por isso temos que "mockar" esse modulo 
const axios = require('axios')

// Isso é pra quando o axios for invocado, ele nao vai invocar o axios de verdade que ta no api-bcb , e sim a versao que criamos aqui
jest.mock('axios')

test('getCotacaoAPI', () => {
  const res = {
    data: {
      value: [
        { cotacaoVenda: 3.90 }
      ]
    }
  }
  axios.get.mockResolvedValue(res)
  api.getCotacaoAPI('url').then(resp => {
    expect(resp).toEqual(res)
    expect(axios.get.mock.calls[0][0]).toBe('url')
  })
})

test('extractCotacao', () => {
  const cotacao = api.extractCotacao({
    data: {
      value: [
        { cotacaoVenda: 3.90 }
      ]
    }
  })
  expect(cotacao).toBe(3.90)
})

//É necessario fazer alguns tratamentos no getToday, pra fixar a data porque ta utilizando o Date, e pra isso utiliza-se o describe pra agrupar testes, pra pegar a data e jogar depois  com o valor na outra função

describe('getToday', () => {
  // É o global Date que tem dentro da api-bcb, entao estamos pegando o Date daqui
  const RealDate = Date

  function mockDate(date) {
    //esse global.Date é o Date dali de cima, ele vai extender a data que era original, mas com uma diferença
    global.Date = class extends RealDate {
      //No construtor a gente retorna outra coisa, retorna um novo RealDate, passando o date que queremos do mockDate, com isso fixamos a data com mockDate
      constructor() {
        return new RealDate(date)
      }
    }
  }

  //Depois que rodar cada teste, podemos fazer uma função que volta o date pro que era antes, pra no ficar eternamente como um date falso
  afterEach(() => {
    global.Date = RealDate
  })

  test('getToday', () => {
    mockDate('2019-01-01T12:00:00z')
    const today = api.getToday()
    expect(today).toBe('1-1-2019')
  })
})

test('getUrl', () => {
  const url = api.getUrl('Minha-data')
  expect(url).toBe(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27Minha-data%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`)
})

test('getCotacao', () => {
  //criando versoes falsas pras todas
  const getToday = jest.fn()
  const getUrl = jest.fn()
  const getCotacaoAPI = jest.fn()
  const extractCotacao = jest.fn()

  //Quando for chamar o getCotacao, precisamos passar essas funções pra ele
  getToday.mockReturnValue('01-01-2019')
  getUrl.mockReturnValue('url')

  res = {
    data: {
      value: [
        { cotacaoVenda: 3.90}
      ]
    }
  }

  getCotacaoAPI.mockResolvedValue(res)
  extractCotacao.mockReturnValue(3.9)

  //agora passa todas essas funções que criei em cima, isso me retorna uma função, ai fazemos um then
  api.pure.getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao})()
     .then( res => {
       expect(res).toBe(3.9)
     })

})

//agora vamos fazer quando da um exception
test('getCotacao', () => {
  const getToday = jest.fn()
  const getUrl = jest.fn()
  const getCotacaoAPI = jest.fn()
  const extractCotacao = jest.fn()

  getToday.mockReturnValue('01-01-2019')
  getUrl.mockReturnValue('url')

  //vazio porque simula que nao pegou o valor
  res = {
  }

  getCotacaoAPI.mockReturnValue(Promise.reject('err'))
  extractCotacao.mockReturnValue(3.9)

  api.pure.getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao})()
     .then( res => {
       expect(res).toBe('')
     })

})