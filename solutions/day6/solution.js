const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const coordinates = input
    .split('\n')
    .filter(n => n)
    .map(n => {
      return n.split(',')
        .map(x => {
          return Number.parseInt(x.trim())
        })
    })
    .map(n => {
      return { x: n[0], y: n[1] }
    })

  await solveForFirstStar(coordinates)
  await solveForSecondStar(coordinates)
}

async function solveForFirstStar (coordinates) {
  let solution = 'UNSOLVED'
  report('Coordinates:', coordinates)
  report('Solution 1:', solution)
}

async function solveForSecondStar (coordinates) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
