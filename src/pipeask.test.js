const fm = require('./pipeask');
const M = require('monet')

let testfn1, testfn2, testfn3
let testprom1, testprom2, testprom3
beforeEach(() => {
  testfn1 = jest.fn(n => n+1)
  testfn2 = jest.fn(n => n+2)
  testfn3 = jest.fn(n => n+3)
  testprom1 = jest.fn(n => Promise.resolve(n-1))
  testprom2 = jest.fn(n => Promise.resolve(n-2))
  testprom3 = jest.fn(n => Promise.resolve(n-3))
})

describe('Test dependency injection with Readers/ask',() => {

  beforeEach(() => {
    testAsk1 = jest.fn(a => b => a + b)
    testPromAsk1 = jest.fn(a => b => Promise.resolve(a + b))
  })

  test('pipeAsk test', async () => {
    var asktest = fm.pipeAsk(
       testfn1,
       fm.chainAsk(n => testAsk1(n)),
       testfn3,
    )
    asktest.needMonad = true
    var asktest2 = fm.pipeAsk(
       testfn1,
       fm.chainAsk(n => testAsk1(n)),
       asktest,
    )(M.Reader.of(0))
    expect(asktest2.run(1)).toEqual(7)

  })

  test('pipeAsyncAsk test', async () => {
    var askt = fm.pipeAsyncAsk(
       testprom1,
       testprom2,
       testprom3,
    )
    var asktest = fm.pipeAsyncAsk(
       testprom1,
       fm.chainPromAsk(n => testPromAsk1(n)),
       testprom3,
    )
    asktest.needMonad = true
    var asktest2 = fm.pipeAsyncAsk(
       testprom1,
       fm.chainPromAsk(n => testPromAsk1(n)),
       asktest,
    )(M.Reader.of(0))

    await expect(askt(M.Reader.of(0)).run()).resolves.toEqual(-6)
    await expect(asktest2.run(1)).resolves.toEqual(-3)

  })

})


