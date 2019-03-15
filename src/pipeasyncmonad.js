const M = require('monet')

const pipeAsyncMonad = Monad => (...fns) => x => (
  fns.reduce((state, fn) => state.map(async (n) => fn(await n)), (x.flatMap ?  x : Monad.of(x)) )
);
const pipeAsyncReader = pipeAsyncMonad(M.Reader)
const pipeAsyncMaybe = pipeAsyncMonad(M.Maybe)
const pipeAsyncEither = pipeAsyncMonad(M.Either)

exports.pipeAsyncMonad = pipeAsyncMonad
exports.pipeAsyncReader = pipeAsyncReader
exports.pipeAsyncMaybe = pipeAsyncMaybe
exports.pipeAsyncEither = pipeAsyncEither

