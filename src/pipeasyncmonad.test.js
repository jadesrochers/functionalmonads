const fm = require('./pipeasyncmonad');
const M = require('monet')

let testprom1, testprom2, testprom3
beforeEach(() => {
  testprom1 = jest.fn(n => Promise.resolve(n-1))
  testprom2 = jest.fn(n => Promise.resolve(n-2))
  testprom3 = jest.fn(n => Promise.resolve(n-3))
})

test('pipeAsyncReader test', async () => {
  var redtest = fm.pipeAsyncReader(
     testprom1,
     testprom2,
     testprom3,
  )(0)
  var redtest2 = fm.pipeAsyncReader(
     testprom1,
     testprom2,
     testprom3,
  )(M.Reader.of(0))
  expect(await redtest.run()).toEqual(-6)
  expect(await redtest2.run()).toEqual(-6)

})

test('pipeAsyncMaybe test', async () => {
  var maytest = fm.pipeAsyncMaybe(
     testprom1,
     testprom2,
     testprom3,
  )(M.Maybe.fromFalsy(false))
  var maytest2 = fm.pipeAsyncMaybe(
     testprom1,
     testprom2,
     testprom3,
  )(3)
  expect(maytest.isSome()).toEqual(false)
  await expect(maytest2.some()).resolves.toEqual(-3)

})

test('pipeAsyncEither test', async () => {
  var eittest = await fm.pipeAsyncEither(
     testprom1,
     testprom2,
     testprom3,
  )(M.Either.left(6))
  var eittest2 = await fm.pipeAsyncEither(
     testprom1,
     testprom2,
     testprom3,
  )(0)
  expect(eittest.left()).toEqual(6)
  await expect(eittest2.right()).resolves.toEqual(-6)

})


