const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const tests = parseInput(input)

  await solveForFirstStar(tests)
  await solveForSecondStar(input)
}

// 10 players; last marble is worth 1618 points: high score is 8317
const lineRegex = /(\d+) players; last marble is worth (\d+) points: high score is (solution|\d+)/
function parseInput (input) {
  return input.split('\n').map(n => n).map(line => {
    const matches = line.match(lineRegex)
    return {
      playerCount: Number.parseInt(matches[1]),
      lastMarbleValue: Number.parseInt(matches[2]),
      expectedHighScore: matches[3] === 'solution' ? matches[3] : Number.parseInt(matches[3])
    }
  })
}

async function solveForFirstStar (tests) {
  let solution = 'UNSOLVED'
  report('Tests:', tests)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
