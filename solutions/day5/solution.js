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

  const reactedPolymer = fullyReactPolymer(input)

  let solution = reactedPolymer.length
  report('Final polymer:', reactedPolymer)
  report('Solution 1:', solution)
}

function fullyReactPolymer(polymerString) {
  let polymer = polymerString.split('')

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
     // report('Polymer length:', polymer.length)
  } while (reactPolymer(polymer))

  return polymer.join('')
}

async function solveForSecondStar (input) {
  const uniqueCharacters = [...new Set(input.toLowerCase().split(''))]
  report('Unique Characters', uniqueCharacters.join(' '))

  const sequences = uniqueCharacters.map(char => {
    return {
      char,
      polymer: input.split('').filter(c => c.toLowerCase() !== char).join('')
    }
  }).map(sequence => {
    sequence.reactedPolymer = fullyReactPolymer(sequence.polymer)
    return sequence
  })

  const shortestPolymer = sequences.sort((a, b) => a.reactedPolymer.length - b.reactedPolymer.length)[0]
  let solution = shortestPolymer.reactedPolymer.length

  report('Shorted polymer', shortestPolymer)
  report('Solution 2:', solution)
}

run()
