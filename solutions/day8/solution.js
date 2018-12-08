const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const numbers = input.split(' ').filter(n => n).map(n => Number.parseInt(n))

  await solveForFirstStar(numbers)
  await solveForSecondStar(numbers)
}

async function solveForFirstStar (numbers) {
  let metaDataTotal = 0

  let i = -1
  function nextNumber () {
    i++
    return numbers[i]
  }

  function readNode (numbers, nodes) {
    const node = {
      start: i,
      metaData: []
    }
    const children = []
    const numChildren = nextNumber()
    const numMetaData = nextNumber()

    while (children.length < numChildren) {
      children.push(readNode(numbers, nodes))
    }

    while (node.metaData.length < numMetaData) {
      let metaDataNum = nextNumber()
      metaDataTotal += metaDataNum
      node.metaData.push(metaDataNum)
    }

    nodes.push(node)

    return node
  }

  const nodes = []
  readNode(numbers, nodes)

  report('Writing nodes', nodes.length)
  await write(fromHere('nodes.json'), JSON.stringify({ nodes }, null, 2), 'utf8')

  const solution = metaDataTotal

  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
