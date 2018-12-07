const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  const dependencies = input.split('\n').filter(n => n).map(parseInstruction)

  await solveForFirstStar(dependencies)
  await solveForSecondStar(input)
}

// Step M must be finished before step Z can begin.
const instructionLineRegex = /Step ([A-Z]) must be finished before step ([A-Z]) can begin\./
function parseInstruction (line) {
  const matches = line.match(instructionLineRegex)
  return {
    step: matches[1],
    dependsOn: matches[2]
  }
}

async function solveForFirstStar (dependencies) {
  let solution = 'UNSOLVED'
  report('Dependencies:', dependencies)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
