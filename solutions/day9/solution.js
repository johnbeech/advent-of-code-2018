const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const games = parseGamesFromInput(input)

  await solveForFirstStar(games)
  await solveForSecondStar(games)
}

// 10 players; last marble is worth 1618 points: high score is 8317
const lineRegex = /(\d+) players; last marble is worth (\d+) points: high score is (solution|\d+)/
function parseGamesFromInput (input) {
  return input.split('\n').map(n => n).map(line => {
    const matches = line.match(lineRegex)
    return {
      playerCount: Number.parseInt(matches[1]),
      marbleCount: Number.parseInt(matches[2]),
      expectedHighScore: matches[3] === 'solution' ? matches[3] : Number.parseInt(matches[3])
    }
  })
}

async function solveForFirstStar (games) {
  let solution = 'UNSOLVED'

  const gameResults = games.map(playGame)

  await write(fromHere('game-results.json'), JSON.stringify({ games: gameResults }, null, 2), 'utf8')

  const gameSummaries = gameResults.map(result => {
    return {
      game: {
        playerCount: result.game.playerCount,
        marbleCount: result.game.marbleCount,
        expectedHighScore: result.game.expectedHighScore
      },
      winner: result.players.map(player => {
        return { playerId: player.playerId, score: player.score }
      }).sort((a, b) => b.score - a.score)[0]
    }
  })

  report(gameSummaries)

  report('Solution 1:', solution)
}

function playGame (game, gameIndex) {
  const marbles = []
  while (marbles.length < game.marbleCount) {
    marbles.push({ value: marbles.length })
  }

  const players = []
  while (players.length < game.playerCount) {
    players.push({
      playerId: players.length + 1,
      marbles: [],
      score: 0
    })
  }

  let turn = 0
  let currentMarble, prevJoin, nextJoin
  while (turn < game.marbleCount) {
    let player = players[turn % players.length]
    let newMarble = marbles[turn]
    if (!newMarble) {
      report('No marble found on turn', turn, game.marbleCount)
    }
    if (turn === 0) {
      // place the first marble in the circle
      currentMarble = newMarble
      currentMarble.nextMarble = newMarble
      currentMarble.prevMarble = newMarble
    } else if (turn % 23 === 0) {
      // remove the new marble and score
      let n = 0
      while (n < 7) {
        currentMarble = currentMarble.prevMarble
        n++
      }

      prevJoin = currentMarble.prevMarble
      nextJoin = currentMarble.nextMarble

      delete currentMarble.prevMarble
      delete currentMarble.nextMarble

      prevJoin.nextMarble = nextJoin
      nextJoin.prevMarble = prevJoin

      player.marbles.push(newMarble)
      player.marbles.push(currentMarble)
      player.score += newMarble.value + currentMarble.value

      currentMarble = nextJoin
    } else {
      // add new marble
      // report('Game', gameIndex, 'Current marble', currentMarble.value)
      prevJoin = currentMarble.nextMarble
      nextJoin = currentMarble.nextMarble.nextMarble

      prevJoin.nextMarble = newMarble
      nextJoin.prevMarble = newMarble
      newMarble.nextMarble = nextJoin
      newMarble.prevMarble = prevJoin

      currentMarble = newMarble
    }
    turn++
  }

  return { game, players }
}

async function solveForSecondStar (games) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
