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
      sample.instruction = {
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

const operations = [
  {
    name: 'Addition',
    code: 'addr',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] + reg[b] }
  }, {
    name: 'Addition',
    code: 'addi',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] + b }
  }, {
    name: 'Multiplication',
    code: 'mulr',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] * reg[b] }
  }, {
    name: 'Multiplication',
    code: 'muli',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] * b }
  }, {
    name: 'Bitwise AND',
    code: 'banr',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] & reg[b] }
  }, {
    name: 'Bitwise AND',
    code: 'bani',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] & b }
  }, {
    name: 'Bitwise OR',
    code: 'borr',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] | reg[b] }
  }, {
    name: 'Bitwise OR',
    code: 'bori',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] | b }
  }, {
    name: 'Assignment',
    code: 'setr',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] }
  }, {
    name: 'Assignment',
    code: 'seti',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = a }
  }, {
    name: 'Greater-than Testing',
    code: 'gtir',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = a > reg[b] ? 1 : 0 }
  }, {
    name: 'Greater-than Testing',
    code: 'gtri',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] > b ? 1 : 0 }
  }, {
    name: 'Greater-than Testing',
    code: 'gtrr',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] > reg[b] ? 1 : 0 }
  }, {
    name: 'Equality Testing',
    code: 'eqir',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = a === reg[b] ? 1 : 0 }
  }, {
    name: 'Equality Testing',
    code: 'eqri',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] === b ? 1 : 0 }
  }, {
    name: 'Equality Testing',
    code: 'eqrr',
    fn: ({ opCode, a, b, c }, reg) => { reg[c] = reg[a] === reg[b] ? 1 : 0 }
  }
]

async function solveForFirstStar (opCodeSamples) {
  await write(fromHere('opcode-samples.json'), JSON.stringify(opCodeSamples, null, 2), 'utf8')

  const tests = opCodeSamples.map(testSample)
  report('Ran', tests.length * operations.length, 'tests for', tests.length, 'samples.')
  const solution = tests.filter(ops => ops.length > 2).length

  report('Solution 1:', solution)
}

function testSample ({ before, after, instruction }) {
  const validOperations = operations.map(operation => {
    report('Operation', instruction)
    operation.fn(instruction, before)
    const actual = before
    const expected = after
    if (actual.join('') === expected.join('')) {
      return { before, after, instruction, operation: operation.code }
    }
    return false
  }).filter(n => n)
  return validOperations
}

async function solveForSecondStar (input) {
  let solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
