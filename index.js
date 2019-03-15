const lflat = require('./src/liftflat')
const pmonad = require('./src/pipemonad')
const pamonad = require('./src/pipeasyncmonad')
const pipea = require('./src/pipeask')

let combine
combine = {...combine,...lflat}
combine = {...combine,...pmonad}
combine = {...combine,...pamonad}
combine = {...combine,...pipea}
module.exports = combine 
