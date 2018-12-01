const path = require('path')
const {read} = require('promise-path')

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  let solution = 'UNSOLVED'

  report(input, solution)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
