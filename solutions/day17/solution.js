const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  const clayScans = parseClayScan(input)
  const boundary = findBoundaryFrom(clayScans)

  report('Boundary:', boundary, 'Clay scans:', clayScans.length)
  await write(fromHere('clay-scans.json'), JSON.stringify({ boundary, scans: clayScans }, null, 2), 'utf8')

  await solveForFirstStar(clayScans, boundary)
  await solveForSecondStar(input)
}

function parseClayScan (input) {
  const clayScanRegex = /([xy])=(\d+), ([xy])=(\d+)..(\d+)/
  const lines = input.split('\n').filter(n => n.trim())
  const scans = lines.map(line => {
    const m = line.match(clayScanRegex)
    if (!m) {
      report(line, 'did not match', clayScanRegex)
    }
    const scan = {}
    const a = m[1]
    const av = Number.parseInt(m[2])
    const b = m[3]
    const bv1 = Number.parseInt(m[4])
    const bv2 = Number.parseInt(m[5])
    scan[`${a}1`] = av
    scan[`${a}2`] = av
    scan[`${b}1`] = bv1
    scan[`${b}2`] = bv2
    return scan
  })
  return scans
}

function findBoundaryFrom (scans) {
  const boundary = scans.reduce((acc, scan) => {
    acc.top = Math.min(acc.top, scan.y1)
    acc.bottom = Math.max(acc.bottom, scan.y2)
    acc.left = Math.min(acc.left, scan.x1)
    acc.right = Math.max(acc.right, scan.x2)
    return acc
  }, { top: 0, bottom: 0, left: 500, right: 500 })

  boundary.top = 0

  return boundary
}

async function solveForFirstStar (clayScans, boundary) {
  let solution = 'UNSOLVED'

  const cells = constructClayBoundary(clayScans)
  cells[`500,0`] = {
    type: '+',
    x: 500,
    y: 0,
    open: true
  }
  await write(fromHere('start-state.txt'), renderCells(cells, boundary), 'utf8')
  let iteration = 0
  let cellCount = 0
  const openCells = Object.values(cells).filter(cell => cell.type === '+')
  do {
    cellCount = Object.keys(cells).length
    flood(cells, openCells, boundary)
    iteration++
    if (iteration === 46) {
      break
    }
    report('Cell count', iteration, ':', Object.keys(cells).length, cellCount, 'Open cells:', openCells.length)
  } while (Object.keys(cells).length > cellCount)

  await write(fromHere('end-state.txt'), renderCells(cells, boundary), 'utf8')

  report('Clay scans:', clayScans.length, 'Iterations:', iteration)
  report('Solution 1:', solution)
}

function renderCells (cells, boundary) {
  let output = ''
  for (let j = boundary.top; j <= boundary.bottom; j++) {
    for (let i = boundary.left; i <= boundary.right; i++) {
      output += (cells[`${i},${j}`] || { type: '.' }).type
    }
    output += '\n'
  }
  return output
}

function constructClayBoundary (clayScans) {
  const cells = clayScans.reduce((acc, scan) => {
    for (let j = scan.y1; j <= scan.y2; j++) {
      for (let i = scan.x1; i <= scan.x2; i++) {
        let key = `${i},${j}`
        acc[key] = {
          type: '#',
          x: i,
          y: j,
          open: false
        }
      }
    }
    return acc
  }, {})

  return cells
}

const downDirection = { x: 0, y: 1 }
const sideDirections = [
  { x: -1, y: 0 },
  { x: 1, y: 0 }
]
function flood (cells, openCells, boundary) {
  const focus = []
  while (openCells.length > 0) {
    focus.push(openCells.pop())
  }
  focus.forEach(cell => {
    if (floodDown(cell)) {
    } else {
      openCells.push(cell)
      sideDirections.forEach(direction => floodSideways(cell, direction))
    }
  })

  function floodDown (cell) {
    const direction = downDirection
    let i = cell.x + direction.x
    let j = Math.min(cell.y + direction.y, boundary.bottom)
    const floodCell = getCell(i, j)
    if ((cell.type === '|' || cell.type === '+') && floodCell.type === '.') {
      floodCell.type = '|'
      openCells.push(floodCell)
      cells[`${i},${j}`] = floodCell
      return true
    }
    return false
  }

  function floodSideways (cell, direction) {
    let i = cell.x + direction.x
    let j = Math.min(cell.y + direction.y, boundary.bottom)
    if (j === boundary.bottom) {
      return false
    }
    const floodCell = getCell(i, j)
    const baseCell = getCell(i, j + 1)
    if (floodCell.type === '.') {
      if (baseCell.type === '#') {
        floodCell.type = '|'
      }
      if (baseCell.type === '~') {
          floodCell.type = '|'
      }
    }
  }

  function getCell (x, y) {
    const key = `${x},${y}`
    const cell = cells[key] || { type: '.', x, y }
    cells[key] = cell
    return cell
  }
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
