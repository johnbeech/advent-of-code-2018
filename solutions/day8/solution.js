const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const numbers = input.split(' ').filter(n => n).map(n => Number.parseInt(n))

  await solveForFirstStar(numbers)
  await solveForSecondStar(numbers)
}

async function solveForFirstStar (numbers) {
  let solution = 'UNSOLVED'
  report('Numbers:', numbers)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
