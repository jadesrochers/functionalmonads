const M = require('monet')
const R = require('ramda')
const ask = M.Reader.ask

const chainAsk = fn => {
  rslt = n => ask().map(env => fn(env)(n))
  rslt.flatMap = true;
  return rslt
}
// Use ask() when there might be promises involved
const chainPromAsk = fn => {
  rslt = n => ask().map(env => R.then(fn(env))(n));
  rslt.flatMap = true;
  return rslt
}

// Deals with Sub functions that need the Reader, Ask() functions,
// and the standard case.
const pipePromSwitch = (fn, n) => {
    if(fn.needMonad){ 
      return fn(M.Reader.of(n))
    }
    return (fn.flatMap ? fn(n) : M.Reader.of(R.then(fn)(n)))
}

const pipeSwitch = (fn, n) => {
    if(fn.needMonad){ 
      return fn(M.Reader.of(n))
    }
    return (fn.flatMap ? fn(n) : M.Reader.of(fn(n)))
}

// For use when you need a Reader in the pipe.
const pipeAsk = (...fns) => x => (
  fns.reduce((state, fn) => state.chain(n => {
    return pipeSwitch(fn, n)
  }),(x.flatMap ?  x : M.Reader.of(x)) )
); 
// For when you need a Reader and promise handling capabilities.
const pipeAsyncAsk = (...fns) => x => (
  fns.reduce((state, fn) => state.chain(n => {
    if(! n.then){ n = Promise.resolve(n)}
    return pipePromSwitch(fn, n)
    }),
    (x.flatMap ?  x : M.Reader.of(x)) )
);

exports.chainAsk = chainAsk
exports.chainPromAsk = chainPromAsk
exports.pipeAsk = pipeAsk
exports.pipeAsyncAsk = pipeAsyncAsk

