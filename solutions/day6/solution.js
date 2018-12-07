const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const coordinates = input
    .split('\n')
    .filter(n => n)
    .map(n => {
      return n.split(',')
        .map(x => {
          return Number.parseInt(x.trim())
        })
    })
    .map(n => {
      return { x: n[0], y: n[1] }
    })

  await solveForFirstStar(coordinates)
  await solveForSecondStar(coordinates)
}

async function solveForFirstStar (coordinates) {
  report('Coordinates:', coordinates)

  const boundary = coordinates.reduce(findBoundary, {})

  report('Boundary:', boundary)

  const positions = generateEmptyPositions(boundary, coordinates)

  await write(fromHere('visualisation.json'), JSON.stringify({ boundary, coordinates, positions }, null, 2), 'utf8')

  let solution = 'UNSOLVED'
  report('Solution 1:', solution)
}

function findBoundary (boundary, coordinate) {
  boundary.top = boundary.top ? Math.min(boundary.top, coordinate.y) : coordinate.y
  boundary.left = boundary.left ? Math.min(boundary.left, coordinate.x) : coordinate.x
  boundary.bottom = boundary.bottom ? Math.max(boundary.bottom, coordinate.y) : coordinate.y
  boundary.right = boundary.right ? Math.max(boundary.right, coordinate.x) : coordinate.x
  return boundary
}

function generateEmptyPositions (boundary, coordinates) {
  let positions = []
  const coordStrings = coordinates.map(n => n.x + ',' + n.y)
  for (let j = boundary.top; j <= boundary.bottom; j++) {
    for (let i = boundary.left; i <= boundary.right; i++) {
      positions.push({ x: i, y: j, key: `${i},${j}` })
    }
  }

  positions = positions.filter(n => !coordStrings.includes(n.key))

  return positions
}

async function solveForSecondStar (coordinates) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
