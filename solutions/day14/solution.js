const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = Number.parseInt((await read(fromHere('input.txt'), 'utf8')).trim())

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

async function solveForFirstStar (input) {
  const elves = [{ recipeIndex: 0 }, { recipeIndex: 1 }]
  const scoreboard = [3, 7]
  let iteration = 0
  while (scoreboard.length < input + 10) {
    populateScoreboard(elves, scoreboard)
    if (scoreboard.length < 20) {
      report(iteration, ':', scoreboard.join(' '))
    }
  }

  const solution = scoreboard.slice(input, input + 10).join('')

  report('Input:', input)
  report('Solution 1:', solution)
}

function populateScoreboard (elves, scoreboard) {
  const total = scoreboard[elves[0].recipeIndex] + scoreboard[elves[1].recipeIndex]
  const digits = (total + '').split('').map(n => Number.parseInt(n))
  scoreboard.push(...digits)
  elves[0].recipeIndex = (1 + elves[0].recipeIndex + scoreboard[elves[0].recipeIndex]) % scoreboard.length
  elves[1].recipeIndex = (1 + elves[1].recipeIndex + scoreboard[elves[1].recipeIndex]) % scoreboard.length
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
