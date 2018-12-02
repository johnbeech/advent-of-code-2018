const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

async function solveForFirstStar (input) {
  report('Input:', input)

  const lines = input.split('\n').map(n => n.trim()).filter(n => n)
  const symbolCounts = lines.map(countSymbols)
  const twosAndThrees = symbolCounts.reduce(countTwosAndThrees, { '2s': 0, '3s': 0 })
  const solution = twosAndThrees['2s'] * twosAndThrees['3s']

  report('Symbol counts', symbolCounts)
  report('Twos and Threes', twosAndThrees)
  report('Solution 1:', solution)
}

function countTwosAndThrees (acc, symbolCount) {
  const containsExactly2ofTheSame = Object.entries(symbolCount).filter(kvp => kvp[1] === 2).length > 0
  if (containsExactly2ofTheSame) {
    acc['2s']++
  }
  const containsExactly3ofTheSame = Object.entries(symbolCount).filter(kvp => kvp[1] === 3).length > 0
  if (containsExactly3ofTheSame) {
    acc['3s']++
  }
  return acc
}

function countSymbols (line) {
  const symbolCount = line.split('').reduce((acc, char) => {
    acc[char] = acc[char] || 0
    acc[char] = acc[char] + 1
    return acc
  }, {})

  return symbolCount
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
