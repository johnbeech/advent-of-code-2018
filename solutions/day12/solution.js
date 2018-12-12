const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const problem = parseInput(input)

  await solveForFirstStar(problem)
  await solveForSecondStar(input)
}

function parseInput (input) {
  const lines = input.split('\n').filter(n => n)
  const initialState = lines.shift().split(':')[1].trim()
  const patterns = lines.map(parsePatternLine)

  return {
    initialState,
    patterns
  }
}

// ..### => .
const patternLineRegex = /([.#]{5}) => ([#.])/
function parsePatternLine (line) {
  const matches = line.match(patternLineRegex)
  return {
    key: matches[1],
    value: matches[2]
  }
}

async function solveForFirstStar (problem) {
  report('Problem:', problem)

  const population = problem.initialState.split('').reduce((acc, item, index) => {
    acc[index] = {
      pos: index,
      state: item
    }
    return acc
  }, {})

  reportPopulationState(population)
  const iterations = []
  let lastIteration = population
  while (iterations.length < 20) {
    lastIteration = advancePopulation(lastIteration, problem.patterns)
    iterations.push(lastIteration)
    reportPopulationState(lastIteration)
  }

  let solution = Object.values(lastIteration).filter(n => n.state === '#').reduce((acc, pot) => {
    return acc + pot.pos
  }, 0)
  report('Solution 1:', solution)
}

function advancePopulation (population, patterns) {
  const result = {}

  const range = {
    min: Math.min(...Object.keys(population).map(n => Number.parseInt(n))),
    max: Math.max(...Object.keys(population).map(n => Number.parseInt(n)))
  }

  // Extend the range of examined pots
  getPot(population, range.min - 1)
  getPot(population, range.min - 2)
  getPot(population, range.max + 1)
  getPot(population, range.max + 2)

  // Match each pot against the patterns
  Object.values(population).forEach(pot => {
    // copy the pot
    result[pot.pos] = {
      pos: pot.pos,
      state: pot.state
    }
    // check if the pot needs to change
    patterns.forEach(pattern => {
      if (potMatchesPattern(pot, pattern.key, population)) {
        result[pot.pos].state = pattern.value
      }
    })
  })

  return result
}

function getPot (pop, index) {
  const pot = pop[index] || { pos: index, state: '.' }
  pop[index] = pot
  return pot
}

function potMatchesPattern (pot, pattern, pop) {
  return pattern.split('')
    .map((n, i) => getPot(pop, pot.pos + i - 2).state === n)
    .reduce((acc, item) => acc && item, true)
}

function reportPopulationState (population) {
  const ordered = Object.values(population).sort((a, b) => a.pos - b.pos)
  report(ordered.map(n => n.pos < 0 ? '-' : '+').join(''))
  report(ordered.map(n => Math.abs(n.pos % 10)).join(''))
  report(ordered.map(n => n.state).join(''))
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
