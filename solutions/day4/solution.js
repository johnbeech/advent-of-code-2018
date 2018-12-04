const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  const events = input.split('\n').filter(n => n).map(parseEventLine)

  await solveForFirstStar(events)
  await solveForSecondStar(events)
}

// [1518-09-05 00:51] wakes up
// [1518-05-29 00:00] Guard #2713 begins shift
// [1518-10-21 00:40] falls asleep
const eventLineRegex = /\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})] (.*)/
const guardBeginsShiftRegex = /Guard #(\d+) begins shift/
function parseEventLine (line) {
  const parts = line.match(eventLineRegex)
  const event = {
    date: parts[1],
    time: parts[2],
    message: parts[3].trim()
  }

  event.timeStamp = (new Date(event.date + ' ' + event.time)).getTime()
  event.wakeUp = event.message === 'wakes up'
  event.fallsAsleep = event.message === 'falls asleep'
  if (guardBeginsShiftRegex.test(event.message)) {
    event.beginsShift = true
    event.guardId = event.message.match(guardBeginsShiftRegex)[1]
  }
  return event
}

async function solveForFirstStar (input) {
  let solution = 'UNSOLVED'
  report('Input:', input)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
