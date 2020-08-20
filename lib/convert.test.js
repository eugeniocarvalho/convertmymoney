const convert = require('./convert')


//teste setando tudo certo
test('convert 4 to 4', () => {
  expect(convert.convert(4, 4)).toBe(16)
})

test('toMoney 2 to 2.00', () => {
  expect(convert.toMoney(2)).toBe('2.00')
})
/*
//teste setando propositalmente um resultado errado
test('convert 4 to 4', () => {
  expect(convert.convert(4, 4)).toBe(18)
})

//teste setando propositalmente uma entrada errada

test('convert 4 to 4', () => {
  expect(convert.convert(2, 4)).toBe(16)
})


test('convert 0 to 4', () => {
  expect(convert.convert(0, 4)).toBe(0)
})

test('toMoney 2 to 2.00', () => {
  expect(convert.toMoney(2)).toBe('2.01')
})

test('toMoney 2 to 2.00 string', () => {
  expect(convert.toMoney('2')).toBe('2.00')
})

*/