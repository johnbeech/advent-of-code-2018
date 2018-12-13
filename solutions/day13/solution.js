const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8'))

  const railway = parseRailway(input)

  await write(fromHere('railyway.json'), JSON.stringify(railway, null, 2), 'utf8')

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

const cartToTrackMap = {
  '>': '-',
  '<': '-',
  '^': '|',
  'v': '|'
}

function isCart (symbol) {
  return !!cartToTrackMap[symbol]
}

function parseRailway (input) {
  const grid = input.split('\n').map(line => line.split(''))

  const carts = []
  grid.forEach((row, j) => {
    row.forEach((cell, i) => {
      if (isCart(cell)) {
        row[i] = cartToTrackMap[cell]
        carts.push({
          cartId: carts.length,
          x: i,
          y: j,
          symbol: cell
        })
      }
    })
  })

  return {
    grid,
    carts,
    collisions: []
  }
}

async function solveForFirstStar (input) {
  let solution = 'UNSOLVED'
  report('Input:', input)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
