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
    left: parts[2],
    top: parts[3],
    width: parts[4],
    height: parts[5]
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
