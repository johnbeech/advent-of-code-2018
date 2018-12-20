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

  await solveForFirstStar(input)
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
