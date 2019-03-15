const M = require('monet')
const pipeMonad = Monad => (...fns) => x => (
  fns.reduce((state, fn) => state.map(n => fn(n)), (x.flatMap ?  x : Monad.of(x)) )
);

const pipeReader = pipeMonad(M.Reader)
const pipeMaybe = pipeMonad(M.Maybe)
const pipeEither = pipeMonad(M.Either)

exports.pipeMonad = pipeMonad
exports.pipeReader = pipeReader
exports.pipeMaybe = pipeMaybe
exports.pipeEither = pipeEither

