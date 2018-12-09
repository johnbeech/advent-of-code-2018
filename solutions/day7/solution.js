const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(parseInstructions(input))
  await solveForSecondStar(parseInstructions(input))
}

function parseInstructions (input) {
  return input.split('\n').filter(n => n).map(parseInstruction)
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

function workOutDependencies (instructions) {
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

  return dependencyIndex
}

async function solveForFirstStar (instructions) {
  const dependencyIndex = workOutDependencies(instructions)

  await write(fromHere('dependencies.json'), JSON.stringify({ dependencies: Object.values(dependencyIndex) }, null, 2), 'utf8')

  let solution = ''

  while (workOnItems()) {
    report('Solution progress:', solution)
  }

  function workOnItems () {
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

  function workOnItem (item) {
    solution += item.step
    item.complete = true
    item.prevents.forEach(k => {
      dependencyIndex[k].dependsOn = dependencyIndex[k].dependsOn.filter(n => n !== item.step)
    })
  }

  report('Dependencies:', dependencyIndex)
  report('Solution 1:', solution)
}

function sortOnStep (a, b) {
  if (a.step < b.step) {
    return -1
  }
  if (a.step > b.step) {
    return 1
  }
  return 0
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
function calculateTimeCost (letter) {
  return 60 + letters.indexOf(letter.toUpperCase()) + 1
}

async function solveForSecondStar (instructions) {
  const dependencyIndex = workOutDependencies(instructions)

  Object.values(dependencyIndex).forEach(item => {
    item.timeRemaining = calculateTimeCost(item.step)
  })

  let timeTaken = 0
  let wordOrder = ''
  const workers = ['W1', 'W2', 'W3', 'W4', 'W5']
  const log = []
  log.push(workers)

  while (workOnItems()) {
    report('Solution progress:', wordOrder, 'after', timeTaken, 'seconds')
  }

  function workOnItems () {
    const logLine = []
    const workableItems = Object.values(dependencyIndex)
      .filter(n => n.timeRemaining && n.dependsOn.length === 0)
      .sort(sortOnStep)
    if (workableItems.length) {
      workers.forEach((worker, index) => {
        const item = workableItems[index]
        if (item) {
          workOnItem(item)
          logLine.push(' ' + item.step)
        } else {
          logLine.push(' .')
        }
      })
      timeTaken++
    }
    log.push(logLine)
    return (workableItems.length)
  }

  function workOnItem (item) {
    item.timeRemaining--
    if (item.timeRemaining === 0) {
      wordOrder += item.step
      item.complete = true
      item.prevents.forEach(k => {
        dependencyIndex[k].dependsOn = dependencyIndex[k].dependsOn.filter(n => n !== item.step)
      })
    }
  }

  await write(fromHere('work-report.txt'), log.map(n => n.join(' ')).join('\n'), 'utf8')

  report('Solution 2:', wordOrder, 'took', timeTaken, 'seconds')
}

run()
