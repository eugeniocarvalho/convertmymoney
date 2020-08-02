const convert = (cotacao, quantidade) => {
  return cotacao * quantidade
}

const toMoney = num => {
  return parseFloat(num).toFixed(2)
}

module.exports = {
  convert,
  toMoney
}