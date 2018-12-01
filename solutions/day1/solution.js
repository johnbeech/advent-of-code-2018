const path = require('path')
const { read } = require('promise-path')
const report = (...messages) => console.log(`[Advent of Code 2018 ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  const frequencies = input.split('\n').filter(n => n).map(n => Number.parseInt(n))

  await solveForFirstStar(frequencies)
  await solveForSecondStar(frequencies)
}

async function solveForFirstStar (frequencies) {
  const solution = frequencies.reduce((acc, n) => acc + n, 0)
  report('Frequency deltas :', frequencies.length, 'Solution 1 :', solution)
}

async function solveForSecondStar (frequencies) {
  let seenFrequencies = { 0: 1 }
  let n = 0
  let frequency = 0
  let solution = null
  while (solution === null) {
    let delta = frequencies[n % frequencies.length]
    frequency = frequency + delta
    let frequencyCount = seenFrequencies[frequency] || 0
    frequencyCount++
    seenFrequencies[frequency] = frequencyCount
    if (frequencyCount >= 2) {
      solution = frequency
    }
    n++
  }
  report('Frequency deltas :', frequencies.length, 'Solution 2 :', solution, ': iterations', n)
}

run()
