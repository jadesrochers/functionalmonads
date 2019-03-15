const fm = require('./liftflat');
const M = require('monet')

let testfn1, testfn2, testfn3
beforeEach(() => {
  testfn1 = jest.fn(n => n+1)
  testfn2 = jest.fn(n => n+2)
  testfn3 = jest.fn(n => n+3)
})

beforeEach(() => {
  retzero = jest.fn(n => 0)
  retblank = jest.fn(n => '')
  retfalse = jest.fn(n => false)
  retund = jest.fn(n => undefined)
  retnull = jest.fn(n => null)
})


test('pipeMayUnd test', () => {
  var maytest = fm.pipeMayUnd(
     testfn1,
     retzero,
     retblank,
     retfalse,
     testfn3,
  )(M.Maybe.fromUndefined(3))
  var maytest2 = fm.pipeMayUnd(
     testfn1,
     retund,
     testfn3,
  )(3)
  expect(maytest.some()).toEqual(3)
  expect(maytest2.isSome()).toEqual(false)

})

test('pipeMayNull test', () => {
  var maytest = fm.pipeMayNull(
     testfn1,
     retzero,
     retblank,
     retfalse,
     testfn3,
  )(M.Maybe.fromNull(3))
  var maytest2 = fm.pipeMayNull(
     testfn1,
     retnull,
     testfn3,
  )(3)
  expect(maytest.some()).toEqual(3)
  expect(maytest2.isSome()).toEqual(false)

})

test('pipeMayFalsy test', () => {
  var maytest = fm.pipeMayFalsy(
     testfn1,
     retzero,
     testfn3,
  )(M.Maybe.fromFalsy(3))
  var maytest2 = fm.pipeMayFalsy(
     testfn1,
     retfalse,
     testfn3,
  )(3)
  var maytest2 = fm.pipeMayFalsy(
     testfn1,
     retblank,
     testfn3,
  )(3)
  expect(maytest.isSome()).toEqual(false)
  expect(maytest2.isSome()).toEqual(false)
  expect(maytest2.isSome()).toEqual(false)

})



