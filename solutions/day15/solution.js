const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(parseCavernMap(input))
  await solveForSecondStar(input)
}

function parseCavernMap (input) {
  const creatures = []
  const cells = []
  input.trim().split('').forEach((row, j) => {
    row.trim().split('').forEach((cell, i) => {
      const wall = cell === '#'
      cells.push({
        x: i,
        y: j,
        wall
      })
      if (!wall && cell !== '.') {
        creatures.push({
          type: cell,
          x: i,
          y: j
        })
      }
    })
  })
  return {
    creatures,
    cells
  }
}

async function solveForFirstStar (cavern) {
  let solution = 'UNSOLVED'
  report('Cavern:', cavern.creatures)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
