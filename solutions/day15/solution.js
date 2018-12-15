const path = require('path')
const { read, write, position } = require('promise-path')
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
  input.trim().split('\n').forEach((row, j) => {
    row.trim().split('').forEach((cell, i) => {
      const wall = cell === '#'
      cells.push({
        x: i,
        y: j,
        wall
      })
      if (!wall && cell !== '.') {
        creatures.push({
          side: cell,
          hitpoints: 200,
          attackPower: 3,
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
  await write(fromHere('cavern.json'), JSON.stringify(cavern, null, 2), 'utf8')

  report('Cavern creatures:', cavern.creatures)
  report('Solution 1:', 'See visualisation: http://localhost:8080/solutions/day15/visualisation.html')
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
