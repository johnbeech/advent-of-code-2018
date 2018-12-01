const path = require('path')
const { read } = require('promise-path')

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  const frequencies = input.split('\n').filter(n => n).map(n => Number.parseInt(n))

  await solveForFirstStar(frequencies)
  await solveForSecondStar(frequencies)
}

async function solveForFirstStar (frequencies) {
  const solution = frequencies.reduce((acc, n) => acc + n, 0)
  report(frequencies, solution)
}

async function solveForSecondStar (frequencies) {
  const solution = 'UNSOLVED'
  report(frequencies.length, solution)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2018 :', solutionName, 'solution for', input, ':', solution)
}

run()
