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

  let polymer = input.split('')

  function reactPolymer(list) {
    let filterNext = false
    const startLength = list.length
    polymer = list.filter((char, index) => {
      if (filterNext) {
        filterNext = false
        return false
      }
      else {
        let next = list[index + 1] || ''
        if (char !== next && char.toLowerCase() === next.toLowerCase()) {
          filterNext = true
          return false
        }
      }
      return true
    })
    return (polymer.length !== startLength)
  }

  do {
     report('Polymer length:', polymer.length)
  } while (reactPolymer(polymer))

  let solution = polymer.length
  report('Final polymer:', polymer.join(''))
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
