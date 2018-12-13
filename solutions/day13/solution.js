const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8'))

  const railway = parseRailway(input)
  await write(fromHere('railyway.json'), JSON.stringify(railway, null, 2), 'utf8')

  await solveForFirstStar(parseRailway(input))
  await solveForSecondStar(parseRailway(input))
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
  if (cart.symbol === 'X') {
    return
  }
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
    const collided = (cart.x === otherCart.x && cart.y === otherCart.y && cart.symbol !== 'X' && otherCart.symbol !== 'X')
    if (collided) {
      cart.symbol = 'X'
      otherCart.symbol = 'X'
      const collision = {
        x: cart.x,
        y: cart.y,
        carts: [cart, otherCart]
      }
      report('New collision', collision)
      railway.collisions.push(collision, collision)
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

async function solveForSecondStar (railway) {
  const numCarts = railway.carts.length
  while (railway.collisions.length < numCarts - 1) {
    railway.carts.forEach(cart => moveCart(cart, railway))
  }

  const remainingCarts = railway.carts.filter(cart => cart.symbol !== 'X')
  let solution = remainingCarts[0] || {}
  report('Solution 2:', solution, `${solution.x},${solution.y}`, 'Remaining carts', remainingCarts.length)

  await write(fromHere('part2-railway-end.txt'), renderRailway(railway), 'utf8')
}

function renderRailway (railway) {
  const grid = JSON.parse(JSON.stringify(railway.grid))
  railway.carts.forEach(cart => {
    grid[cart.y][cart.x] = cart.symbol
  })
  return grid.map(n => n.join('')).join('\n')
}

run()
