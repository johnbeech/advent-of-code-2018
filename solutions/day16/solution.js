const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  const opCodeSamples = parseOpcodeSamples(input)

  await solveForFirstStar(opCodeSamples)
  await solveForSecondStar(input)
}

// Before: [1, 3, 2, 3]
// 11 0 3 0
// After:  [0, 3, 2, 3]
function parseOpcodeSamples (input) {
  let samples = []
  let sample = {}
  const parseInstructions = [{
    regex: /Before: \[(\d+), (\d+), (\d+), (\d+)\]/,
    action: m => {
      sample = {
        before: [m[1], m[2], m[3], m[4]].map(n => Number.parseInt(n))
      }
    }
  }, {
    regex: /^(\d+) (\d+) (\d+) (\d+)$/,
    action: (m) => {
      sample.operation = {
        opCode: Number.parseInt(m[1]),
        a: Number.parseInt(m[2]),
        b: Number.parseInt(m[3]),
        c: Number.parseInt(m[4])
      }
    }
  }, {
    regex: /After: {2}\[(\d+), (\d+), (\d+), (\d+)\]/,
    action: m => {
      sample.after = [m[1], m[2], m[3], m[4]].map(n => Number.parseInt(n))
      samples.push(sample)
    }
  }]

  input.split('\n').filter(n => n.trim()).forEach((line, index) => {
    const step = parseInstructions[index % parseInstructions.length]
    try {
      const matches = line.match(step.regex)
      if (matches) {
        step.action(matches)
      }
    } catch (ex) {
      // ignore
      report(ex)
    }
  })

  return samples
}

async function solveForFirstStar (opCodeSamples) {
  let solution = 'UNSOLVED'

  await write(fromHere('opcode-samples.json'), JSON.stringify(opCodeSamples, null, 2), 'utf8')

  report('Input:', opCodeSamples.length)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
