const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const problem = parseInput(input)

  await solveForFirstStar(problem)
  await solveForSecondStar(input)
}
function parseInput (input) {
  const lines = input.split('\n').filter(n => n)
  const initialState = lines.shift().split(':')[1].trim()
  const patterns = lines.map(parsePatternLine)

  return {
    initialState,
    patterns
  }
}

// ..### => .
const patternLineRegex = /([.#]{5}) => ([#.])/
function parsePatternLine (line) {
  const matches = line.match(patternLineRegex)
  return {
    key: matches[1],
    value: matches[2]
  }
}

async function solveForFirstStar (problem) {
  let solution = 'UNSOLVED'
  report('Problem:', problem)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
