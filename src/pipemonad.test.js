const fm = require('./pipemonad');
const M = require('monet')

let testfn1, testfn2, testfn3
beforeEach(() => {
  testfn1 = jest.fn(n => n+1)
  testfn2 = jest.fn(n => n+2)
  testfn3 = jest.fn(n => n+3)
  testprom3 = jest.fn(n => Promise.resolve(n-3))
})

test('pipeReader test', () => {
  var redtest = fm.pipeReader(
     testfn1,
     testfn2,
     testfn3,
  )(0)
  var redtest2 = fm.pipeReader(
     testfn1,
     testfn2,
     testfn3,
  )(M.Reader.of(0))
  expect(redtest.run()).toEqual(6)
  expect(redtest2.run()).toEqual(6)

})

test('pipeMaybe test', () => {
  var maytest = fm.pipeMaybe(
     testfn1,
     testfn2,
     testfn3,
  )(M.Maybe.fromFalsy(false))
  var maytest2 = fm.pipeMaybe(
     testfn1,
     testfn2,
     testfn3,
  )(3)
  expect(maytest.isSome()).toEqual(false)
  expect(maytest2.some()).toEqual(9)

})

test('pipeEither test', () => {
  var eittest = fm.pipeEither(
     testfn1,
     testfn2,
     testfn3,
  )(M.Either.left(6))
  var eittest2 = fm.pipeEither(
     testfn1,
     testfn2,
     testfn3,
  )(0)
  expect(eittest.left()).toEqual(6)
  expect(eittest2.right()).toEqual(6)
})

