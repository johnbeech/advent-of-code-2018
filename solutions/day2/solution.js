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
  const lines = input.split('\n').map(n => n.trim()).filter(n => n)

  const matches = []
  lines.forEach(firstLine => {
    lines.forEach(secondLine => {
      if (firstLine === secondLine) {
        return
      }
      const nearlyMatchingString = findNearlyMatchingStrings(firstLine, secondLine)
      if (nearlyMatchingString) {
        matches.push(nearlyMatchingString)
      }
    })
  })

  const solution = matches[0]
  report('Solution 2:', solution)
}

function findNearlyMatchingStrings (str1, str2) {
  let diff = 0
  let matchingChars = ''
  let p = 0
  while (p < str1.length) {
    if (str1.charAt(p) !== str2.charAt(p)) {
      diff++
    } else {
      matchingChars += str1.charAt(p)
    }
    p++
  }
  if (diff === 1) {
    return matchingChars
  }
  return false
}

run()
