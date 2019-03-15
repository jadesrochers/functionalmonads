const M = require('monet')

const pipeChain = MaybeMonad => (...fns) => x => fns.reduce((state, fn) => {
   let rslt = state.chain(fn)
   if(rslt === null || rslt === undefined || (! rslt.chain)){
     rslt = MaybeMonad(rslt) 
   }
  return rslt
  }, MaybeMonad(x));

const pipeMayUnd = pipeChain(M.Maybe.fromUndefined)
const pipeMayNull = pipeChain(M.Maybe.fromNull)
const pipeMayFalsy = pipeChain(M.Maybe.fromFalsy)

exports.pipeChain = pipeChain
exports.pipeMayNull = pipeMayNull
exports.pipeMayFalsy = pipeMayFalsy
exports.pipeMayUnd = pipeMayUnd


