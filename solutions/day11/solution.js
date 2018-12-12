const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const grids = input.split('\n').filter(n => n).map(parseInputLine)

  await solveForFirstAndSecondStar(grids)
}

// Grid serial #18 : 33,45 total power of 29
const inputLineRegex = /Grid serial #(\d+) : ([x\d]+),([y\d]+) total power of ([?\d]+)/
function parseInputLine (line) {
  const matches = line.match(inputLineRegex)
  return {
    serial: Number.parseInt(matches[1]),
    expected: {
      x: Number.parseInt(matches[2]) || 'x',
      y: Number.parseInt(matches[3]) || 'y',
      total: Number.parseInt(matches[4]) || '?'
    }
  }
}

async function solveForFirstAndSecondStar (grids) {
  const results = grids.map(solvePowerGrid)

  const solution = results.reverse()[0].actual

  await write(fromHere('power-grids.json'), JSON.stringify(results, null, 2), 'utf8')

  report('Grids:', grids)
  report('Solution 1:', `${solution.x},${solution.y}`)
}

function solvePowerGrid (grid) {
  const cells = createGridCells(grid.serial)

  const actual = cells.sort((a, b) => {
    return b.total - a.total
  })[0]

  const largestCell = cells.sort((a, b) => {
    return b.largestPowerSquare.powerLevel - a.largestPowerSquare.powerLevel
  })[0]

  return {
    actual,
    expected: grid.expected,
    serial: grid.serial,
    largestPowerSquare: largestCell.largestPowerSquare
  }
}

function createGridCells (serial) {
  const cells = []
  let x, y
  // create cells
  while (cells.length < 90000) {
    x = (cells.length % 300) + 1
    y = Math.floor(cells.length / 300) + 1
    cells.push(calculateGridCell(serial, x, y))
  }
  // count power totals
  cells.forEach(calculateCellTotalPower)
  cells.forEach(calculateMaximumPower)

  return cells
}

function calculateGridCell (serial, x, y) {
  // Find the fuel cell's rack ID, which is its X coordinate plus 10.
  let rackId = x + 10
  // Begin with a power level of the rack ID times the Y coordinate.
  let power = rackId * y
  // Increase the power level by the value of the grid serial number (your puzzle input).
  power = power + serial
  // Set the power level to itself multiplied by the rack ID.
  power = power * rackId
  // Keep only the hundreds digit of the power level (so 12345 becomes 3; numbers with no hundreds digit become 0).
  power = Number.parseInt((power + '').split('').reverse('')[2]) || 0
  // Subtract 5 from the power level.
  power = power - 5
  return {
    x, y, rackId, power
  }
}

function calculateCellTotalPower (cell, index, cells) {
  const cellOffsets = generateCellOffsets(3)
  cell.total = cellOffsets.reduce((acc, offset) => {
    const xo = (cell.x + offset.x) - 1
    const yo = (cell.y + offset.y) - 1
    const co = cells[yo * 300 + xo] || { xo, yo, power: -5 }
    return acc + co.power
  }, 0)
}

const cellOffsetCache = {}
function generateCellOffsets (size) {
  let offsets = cellOffsetCache[size]
  if (offsets) {
    return offsets
  }
  offsets = []
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      offsets.push({ x: i, y: j })
    }
  }
  cellOffsetCache[size] = offsets

  return offsets
}

function calculateMaximumPower (cell, index, cells) {
  const maxSize = Math.min(301 - cell.x, 301 - cell.y)
  const solutions = []
  while (solutions.length < maxSize) {
    let size = solutions.length + 1
    let cellOffsets = generateCellOffsets(size)
    let powerLevel = cellOffsets.reduce((acc, offset) => {
      const xo = (cell.x + offset.x) - 1
      const yo = (cell.y + offset.y) - 1
      const co = cells[yo * 300 + xo] || { xo, yo, power: -5 }
      return acc + co.power
    }, 0)
    solutions.push({ size, powerLevel })
  }
  const largest = solutions.sort((a, b) => {
    return b.powerLevel - a.powerLevel
  })[0]

  if (!largest) {
    report('No largest', solutions, 'for', cell)
  } else {
    report('Solution', 'for', `${cell.x},${cell.y},${largest.size}`, 'power level:', largest.powerLevel)
  }

  cell.largestPowerSquare = {
    size: largest.size,
    powerLevel: largest.powerLevel,
    x: cell.x,
    y: cell.y
  }
}

run()
