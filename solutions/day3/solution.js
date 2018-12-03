const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const claims = parseClaims(input)

  await solveForFirstStar(claims)
  await solveForSecondStar(claims)
}

function parseClaims (input) {
  const lines = input.split('\n').filter(n => n)
  return lines.map(parseClaimLine)
}

// Example claim line: #1 @ 287,428: 27x20
const claimLineRegex = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/
function parseClaimLine (line) {
  const parts = line.match(claimLineRegex)
  return {
    claimId: parts[1],
    left: parseInt(parts[2]),
    top: parseInt(parts[3]),
    width: parseInt(parts[4]),
    height: parseInt(parts[5])
  }
}

async function solveForFirstStar (claims) {
  report('Claims:', claims)

  const claimedTiles = claims.reduce(claimArea, {})

  report('Claimed tiles:', claimedTiles)

  const solution = Object.entries(claimedTiles).reduce(countOverlappingClaims, 0)

  report('Solution 1:', solution)
}

function claimArea (area, coords) {
  let key
  for (let y = 0; y < coords.height; y++) {
    for (let x = 0; x < coords.width; x++) {
      key = (coords.left + x) + ',' + (coords.top + y)
      area[key] = area[key] || 0
      area[key]++
    }
  }
  return area
}

function countOverlappingClaims (acc, kvp) {
  if (kvp[1] > 1) {
    return acc + 1
  }
  return acc
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
