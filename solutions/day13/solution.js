const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8'))

  const railway = parseRailway(input)

  await write(fromHere('railyway.json'), JSON.stringify(railway, null, 2), 'utf8')

  await solveForFirstStar(railway)
  await solveForSecondStar(input)
}

const cartToTrackMap = {
  '>': '-',
  '<': '-',
  '^': '|',
  'v': '|'
}

const cartDirectionMap = {
  '>': { x: 1, y: 0 },
  '<': { x: -1, y: 0 },
  '^': { x: 0, y: -1 },
  'v': { x: 0, y: 1 }
}

const cartDirectionChangeMap = {
  '^/': '>',
  '>/': '^',
  'v/': '<',
  '</': 'v',
  '^\\': '<',
  '>\\': 'v',
  'v\\': '>',
  '<\\': '^',
  '^+': '?',
  '>+': '?',
  'v+': '?',
  '<+': '?'
}

const cartTurnOrderMap = {
  '^': ['<', '^', '>'],
  '>': ['^', '>', 'v'],
  'v': ['>', 'v', '<'],
  '<': ['v', '<', '^']
}

function isCart (symbol) {
  return !!cartToTrackMap[symbol]
}

function moveCart (cart, railway) {
  const nx = cart.x + cartDirectionMap[cart.symbol].x
  const ny = cart.y + cartDirectionMap[cart.symbol].y

  const newRail = railway.grid[ny][nx]
  let newSymbol = cartDirectionChangeMap[cart.symbol + newRail] || cart.symbol
  if (newSymbol === '?') {
    newSymbol = cartTurnOrderMap[cart.symbol][cart.turnCount % 3]
    cart.turnCount++
  }
  cart.symbol = newSymbol
  cart.x = nx
  cart.y = ny

  checkForCollisions(cart, railway)
}

function checkForCollisions (cart, railway) {
  railway.carts.reduce((acc, otherCart) => {
    if (cart === otherCart) {
      return acc || false
    }
    const collided = (cart.x === otherCart.x && cart.y === otherCart.y)
    if (collided) {
      cart.symbol = 'X'
      otherCart.symbol = 'X'
      railway.collisions.push({
        x: cart.x,
        y: cart.y,
        carts: [cart, otherCart]
      })
    }
    return acc || collided
  }, false)
}

function parseRailway (input) {
  const grid = input.split('\n').map(line => line.split(''))

  const carts = []
  grid.forEach((row, j) => {
    row.forEach((cell, i) => {
      if (isCart(cell)) {
        row[i] = cartToTrackMap[cell]
        carts.push({
          cartId: carts.length,
          x: i,
          y: j,
          symbol: cell,
          turnCount: 0
        })
      }
    })
  })

  return {
    grid,
    carts,
    collisions: []
  }
}

async function solveForFirstStar (railway) {
  let step = 0
  while (railway.collisions.length === 0) {
    moveCart(railway.carts[step % railway.carts.length], railway)
    step++
  }

  let solution = railway.collisions[0]

  report('Solution 1:', solution, `${solution.x},${solution.y}`)
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
