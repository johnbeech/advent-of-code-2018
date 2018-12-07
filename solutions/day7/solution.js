const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  const instructions = input.split('\n').filter(n => n).map(parseInstruction)

  await solveForFirstStar(instructions)
  await solveForSecondStar(input)
}

// Step M must be finished before step Z can begin.
const instructionLineRegex = /Step ([A-Z]) must be finished before step ([A-Z]) can begin\./
function parseInstruction (line) {
  const matches = line.match(instructionLineRegex)
  return {
    step: matches[1],
    prevents: matches[2]
  }
}

async function solveForFirstStar (instructions) {
  const dependencyIndex = instructions.reduce((acc, item) => {
    const indexItem = acc[item.step] || {
      step: item.step,
      prevents: [],
      dependsOn: []
    }
    indexItem.prevents.push(item.prevents)
    acc[item.step] = indexItem
    return acc
  }, {})

  Object.values(dependencyIndex).forEach(item => {
    item.prevents.forEach(k => {
      const indexItem = dependencyIndex[k] || {
        step: k,
        prevents: [],
        dependsOn: []
      }
      indexItem.dependsOn.push(item.step)
      dependencyIndex[k] = indexItem
    })
  })

  await write(fromHere('dependencies.json'), JSON.stringify({ dependencies: Object.values(dependencyIndex) }, null, 2), 'utf8')

  let solution = ''

  while (workOnItems()) {
    report('Solution progress:', solution)
  }

  function workOnItems() {
    const startSolution = solution
    const readyToStartItems = Object.values(dependencyIndex)
      .filter(n => !n.complete && n.dependsOn.length === 0)
      .sort(sortOnStep)
    if (readyToStartItems.length) {
      workOnItem(readyToStartItems[0])
    }
    report('Ready to start', readyToStartItems)
    return (startSolution !== solution)
  }

  function workOnItem(item) {
    solution += item.step
    item.complete = true
    item.prevents.forEach(k => {
      dependencyIndex[k].dependsOn = dependencyIndex[k].dependsOn.filter(n => n !== item.step)
    })
  }

  report('Dependencies:', dependencyIndex)
  report('Solution 1:', solution)
}

function sortOnStep(a, b) {
  if (a.step < b.step) {
    return -1
  }
  if (a.step > b.step) {
    return 1
  }
  return 0
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
