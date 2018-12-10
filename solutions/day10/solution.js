const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  const coordinateVelocities = parseCoordinateVelocities(input)

  await solveForFirstStar(coordinateVelocities)
  await solveForSecondStar(coordinateVelocities)
}

function parseCoordinateVelocities (input) {
  return input.split('\n').filter(n => n).map(parseCoordinateVelocityLine)
}

// position=< 1,  6> velocity=< 1,  0>
const coordinateVelocityLineRegex = /position=< ?(-?\d+),  ?(-?\d+)> velocity=< ?(-?\d+),  ?(-?\d+)>/
function parseCoordinateVelocityLine (line) {
  const matches = line.match(coordinateVelocityLineRegex)
  return {
    x: Number.parseInt(matches[1]),
    y: Number.parseInt(matches[2]),
    vx: Number.parseInt(matches[3]),
    vy: Number.parseInt(matches[4])
  }
}

function findBoundary (coordinates) {
  const boundary = coordinates.reduce((acc, item) => {
    acc.top = acc.top !== undefined ? Math.min(item.y, acc.top) : item.y
    acc.left = acc.left !== undefined ? Math.min(item.x, acc.left) : item.x
    acc.right = acc.right !== undefined ? Math.max(item.x, acc.right) : item.x
    acc.bottom = acc.bottom !== undefined ? Math.max(item.y, acc.bottom) : item.y
    return acc
  }, {})
  boundary.size = {
    height: Math.abs(boundary.bottom - boundary.top),
    width: Math.abs(boundary.right - boundary.left)
  }
  boundary.area = boundary.size.width * boundary.size.height
  return boundary
}

async function solveForFirstStar (coordinates) {
  let boundary = findBoundary(coordinates)
  let area

  function stillShrinking (area1, area2) {
    return area1 < area2
  }

  do {
    area = boundary.area
    coordinates = updateCoordinates(coordinates)
    boundary = findBoundary(coordinates)
  } while (stillShrinking(boundary.area, area))

  await write(fromHere('visualisation.json'), JSON.stringify({ coordinates, boundary }, null, 2), 'utf8')

  report('Input:', coordinates, boundary)
  report('Solution 1:', 'Open http://localhost:8080/solutions/day10/visualisation.html')
}

function updateCoordinates (coordinates, dt = 1) {
  return coordinates.map(n => {
    return {
      x: n.x + n.vx * dt,
      y: n.y + n.vy * dt,
      vx: n.vx,
      vy: n.vy
    }
  })
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
