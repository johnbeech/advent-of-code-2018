const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const numbers = input.split(' ').filter(n => n).map(n => Number.parseInt(n))

  await solveForFirstAndSecondStar(numbers)
}

async function solveForFirstAndSecondStar (numbers) {
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

    if (children.length) {
      node.value = node.metaData.reduce((a, b) => {
        const child = children[b - 1]
        if (child) {
          return a + child.value
        }
        return a
      }, 0)
    } else {
      node.value = node.metaData.reduce((a, b) => a + b, 0)
    }

    nodes.push(node)

    return node
  }

  const nodes = []
  const startNode = readNode(numbers, nodes)

  report('Writing nodes', nodes.length)
  await write(fromHere('nodes.json'), JSON.stringify({ nodes }, null, 2), 'utf8')

  const solution = metaDataTotal

  report('Solution 1:', solution)
  report('Solution 2:', startNode.value)
}

run()
