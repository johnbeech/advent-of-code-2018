const path = require('path')
const { read, position, write } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  const events = input.split('\n').filter(n => n).map(parseEventLine).sort(sortOnTime)
  const guards = events.reduce(identifyGuardsFromEvents, {})

  await write(fromHere('guards.json'), JSON.stringify(guards, null, 2), 'utf8')

  await solveForFirstStar(guards)
  await solveForSecondStar(guards)
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
  event.wakesUp = event.message === 'wakes up'
  event.fallsAsleep = event.message === 'falls asleep'
  if (guardBeginsShiftRegex.test(event.message)) {
    event.beginsShift = true
    event.guardId = Number.parseInt(event.message.match(guardBeginsShiftRegex)[1])
  }
  return event
}

function sortOnTime (ea, eb) {
  return ea.timeStamp - eb.timeStamp
}

let guard
function identifyGuardsFromEvents (guards, event) {
  if (event.guardId) {
    guard = guards[event.guardId] || { guardId: event.guardId, days: {} }
  }
  if (!guard) {
    report('Unexpected event without an assigned guard:', event)
  }
  // otherwise keep last used guard
  let day = guard.days[event.date] || { events: [], minutesAsleep: 0 }
  if (event.beginsShift) {
    day.beganShift = event.time
  }
  if (event.fallsAsleep) {
    day.events.push(event.time)
  }
  if (event.wakesUp) {
    day.events.push(event.time)
    day.minutesAsleep += parseMinutes(day.events[day.events.length - 1]) - parseMinutes(day.events[day.events.length - 2])
  }
  guard.days[event.date] = day
  guards[guard.guardId] = guard

  return guards
}

function parseMinutes (time) {
  return parseInt(time.split(':')[1])
}

function measureGuardSleepingPatterns (guards) {
  return Object.values(guards).map(guard => {
    const minutesAsleep = Object.values(guard.days).reduce((acc, day) => acc + day.minutesAsleep, 0)
    return {
      guardId: guard.guardId,
      minutesAsleep
    }
  })
}

async function solveForFirstStar (guards) {
  const sleepingGuards = measureGuardSleepingPatterns(guards)
  await write(fromHere('sleeping-guards.json'), JSON.stringify(sleepingGuards, null, 2), 'utf8')

  const sleepiestGuard = guards[sleepingGuards.sort((a, b) => b.minutesAsleep - a.minutesAsleep)[0].guardId]
  report('Sleepiest guard', sleepiestGuard)

  const sleepiestMinute = findSleepiestMinute(sleepiestGuard)

  report('Sleepiest Guard Id', sleepiestGuard.guardId, 'Sleepiest Minute', sleepiestMinute)

  let solution = sleepiestGuard.guardId * sleepiestMinute
  report('Solution 1:', solution)
}

function findSleepiestMinute (guard) {
  const minuteMap = Object.values(guard.days).reduce((map, day) => {
    if (!day.events.length) {
      return map
    }
    for (let n = 0; n < day.events.length; n += 2) {
      let sleep = parseMinutes(day.events[n])
      let wakeUp = parseMinutes(day.events[n + 1])
      for (let t = sleep; t < wakeUp; t++) {
        map[t] = map[t] || 0
        map[t]++
      }
    }
    return map
  }, {})
  report('Sleepiest minutes', minuteMap)
  const sortedMinutes = Object.entries(minuteMap).sort((a, b) => b[1] - a[1])
  return sortedMinutes[0][0]
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
