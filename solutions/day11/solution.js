const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const grids = input.split('\n').filter(n => n).map(parseInputLine)

  await solveForFirstStar(grids)
  await solveForSecondStar(grids)
}

// Grid serial #18 : 33,45 total power of 29
const inputLineRegex = /Grid serial #(\d+) : ([x\d]+),([y\d]+) total power of ([?\d+])/
function parseInputLine (line) {
  const matches = line.match(inputLineRegex)
  return {
    serial: matches[1],
    expected: {
      x: matches[2],
      y: matches[3],
      power: matches[4]
    }
  }
}

async function solveForFirstStar (grids) {
  const results = grids.map(solvePowerGrid)

  const solution = results.reverse()[0].actual

  report('Grids:', grids)
  report('Solution 1:', solution.x, solution.y)
}

function solvePowerGrid (grid) {
  return {
    actual: {
      x: 0,
      y: 0
    }
  }
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
