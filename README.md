# Functionalmonads
An experiment in integrating monads with functional programming constructs.  
Just to make it simple to add them into pipe/flow if you want.  

## Whats the Use?
To be able to use monads in the same way as fp in ramda/lodash  
without needing to get into the implementation details each time.

## installation 
npm install @jadesrochers/functionalmonads  
const fm = require('@jadesrochers/functionalmonads')  

## Usage
Four monads available:
Maybe, Either, Ask, Reader
There are some sub versions of these, and async/await support as well.

### Use the Maybe monad to shortcircuit pipes -  
You can pass a monad or a raw value, which will be converted  
into a monad.  
If the pipe encounters a value that changes the monad to None,  
igores the rest of the functions.

#### Setup some test functions to use  
```javascript
const fm = require('@jadesrochers/functionalmonads')  
let retzero = n => 0
let retblank = n => ''
let retfalse = n => false
let retund = n => undefined
let retnull = n => null

let testfn1 = n => n+1
let testfn2 = n => n+2
let testprom1 = n => Promise.resolve(n+1)
let testprom2 = n => Promise.resolve(n+2)

```

#### pipeMayNull pipes functions using a maybe monad for null values  
If there is a null, then the Monad gets switched to None  
and no further functions in the pipe are used.  
```javascript
let maytest = fm.pipeMayNull(
   retzero,
   retblank,
   testfn2,
)(3)
let maytest2 = fm.pipeMayNull(
   testfn1,
   retnull,
   testfn2,
)(3)

maytest.some()
// 2
maytest2.some()
// Error, because it is a None
maytest2.isSome()
// false
```

#### pipeMayUnd pipes functions using a maybe monad for undefined values  
If there is a null, then the Monad gets switched to None  
and no further functions in the pipe are used.  
```javascript
let undtest = fm.pipeMayUnd(
     retblank,
     retfalse,
     testfn2,
 )(3)
let undtest2 = fm.pipeMayUnd(
   testfn1,
   retund,
   testfn2,
 )(3)

undtest.some()
// 2
undtest2.isSome()
// The second test is none because a fcn returned undefined
```

#### pipeMayfalsy pipes functions using a maybe monad for falsy values  
If there is a falsy value (false, blank, empty, 0), then the Monad gets switched to None  
and no further functions in the pipe are used.  
```javascript
let falsetest = fm.pipeMayFalsy(
   retzero,
   testfn1,
)(3)
let falsetest2 = fm.pipeMayFalsy(
   retfalse,
   testfn1,
)(3)
let falsetest3 = fm.pipeMayFalsy(
   retblank,
   testfn1,
)(3)

// All are false
falsetest.isSome()
falsetest2.isSome()
falsetest3.isSome()
```

#### Async version of Reader, Maybe
Unlike the Mayfalsy/und/null these do not lift and flatten so  
the input determines some/none.  
Reader is just for run later abilities.  
```javascript
var redtestAsync = fm.pipeAsyncReader(
   testprom1,
   testprom2,
)(0)
redtestAsync.run().then(n => console.log(n))
// 3

var maytestAsync = fm.pipeAsyncMaybe(
   testprom1,
   testprom2,
)(0)
maytestAsync.isSome()
maytestAsync.some().then(n => console.log(n))
// true, 3
```


#### pipeReader to use a reader monad in pipe
The Reader attaches funtions, but runs only when .run() is called.  
It allows the setup to be run later.
```javascript

let redtest = fm.pipeReader(
   testfn1,
   testfn2,
)(0)

redtest.run()
// 3
```

#### pipeEither to use a either monad in pipe
The Reader attaches funtions, but runs only when .run() is called.  
```javascript
const M = require('monet')
var eithtest = fm.pipeEither(
   testfn1,
   testfn2,
)(M.Either.left(0))
var eithtest2 = fm.pipeEither(
   testfn1,
   testfn2,
)(0)
eithtest.left()
// 0, because the left was ignored
eithtest2.right()
// 3
```

#### pipeAsk allows dependency injection via ask monad  
Pass values at runtime to functions at various places in pipes.  
Makes use of Reader.ask.

**Define function that needs the injected value (second arg)**  
```javascript
let testAsk1 = a => b => a + b
let testPromAsk1 = a => b => Promise.resolve(a + b)
```
**When calling them, use fm.chainAsk to inject the value**  
fm.chainAsk(n => testAsk1(n)),

```javascript
// Define a sub-pipe that needs the injected value
var asktest = fm.pipeAsk(
   testfn1,
   fm.chainAsk(n => testAsk1(n)),
)
// Must add this to make sure the monad gets passed down.
asktest.needMonad = true

// Function calling the nested pipe, and use fm.chainAsk to allow the injection
var asktest2 = fm.pipeAsk(
   testfn1,
   fm.chainAsk(n => testAsk1(n)),
   asktest,
)(0)
// )(M.Reader.of(0))
asktest2.run(1)
// 1 gets passed to testAsk1 in both locations
// 4 
```

#### pipeAsyncAsk  
Same as above, but suppoers async functions
```javascript
let testPromAsk1 = a => b => Promise.resolve(a + b)
let testprom1 = n => Promise.resolve(n+1)
```
**Has its own helper to pass the value -**  
fm.chainPromAsk(n => testPromAsk1(n)),

```javascript
var asktest = fm.pipeAsyncAsk(
   testprom1,
   fm.chainPromAsk(n => testPromAsk1(n)),
)
asktest.needMonad = true

var asktest2 = fm.pipeAsyncAsk(
   testprom1,
   fm.chainPromAsk(n => testPromAsk1(n)),
   asktest,
)(0)
asktest2.run(1).then(n => console.log(n))
// 4
```


