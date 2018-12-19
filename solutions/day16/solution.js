const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const program = (await read(fromHere('program.txt'), 'utf8')).trim()

  const opCodeSamples = parseOpcodeSamples(input)
  const programCode = parseProgram(program)

  await solveForFirstAndSecondStar(opCodeSamples, programCode)
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

function parseProgram (input) {
  const lineRegex = /(\d+) (\d+) (\d+) (\d+)/
  return input.split('\n').filter(n => n.trim()).map(line => {
    const m = line.match(lineRegex)
    return {
      opCode: Number.parseInt(m[1]),
      a: Number.parseInt(m[2]),
      b: Number.parseInt(m[3]),
      c: Number.parseInt(m[4])
    }
  })
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

async function solveForFirstAndSecondStar (opCodeSamples, program) {
  await write(fromHere('opcode-samples.json'), JSON.stringify(opCodeSamples, null, 2), 'utf8')
  await write(fromHere('program.json'), JSON.stringify(program, null, 2), 'utf8')

  const tests = opCodeSamples.map(testSample)
  report('Ran', tests.length * operations.length, 'tests for', tests.length, 'samples.')

  const operationMap = operations.reduce((acc, op) => {
    acc[op.code] = op
    return acc
  }, {})

  const opCodeMap = {}
  const all = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
  const evidence = operations.map(operation => {
    const positives = []
    tests.forEach(test => {
      test.filter(n => n.operation === operation.code).map(n => n.instruction.opCode).forEach(v => positives.push(v))
    })
    let positiveSet = new Set(positives)
    let negatives = new Set([...all].filter(x => !positiveSet.has(x)))
    report('Operation', operation.code, 'Negatives:', [...negatives].join(' '), 'Pos:', [...positiveSet].join(' '))
    return {
      code: operation.code,
      positives: positives,
      excluded: negatives
    }
  })

  const mappedEvidence = evidence.reduce((acc, evidence) => {
    evidence.positives.forEach(code => {
      const entry = acc[code] || {}
      entry[evidence.code] = entry[evidence.code] || 0
      entry[evidence.code]++
      acc[code] = entry
    })
    return acc
  }, {})

  console.log(mappedEvidence)

  const solution1 = tests.filter(ops => ops.length > 2).length
  report('Solution 1:', solution1)

  report('Op code map', opCodeMap, operationMap)

  const registers = [0, 0, 0, 0]
  program.forEach(instruction => {
    const op = opCodeMap[instruction.opCode]
    if (op) {
      op(instruction, registers)
    } else {
      // report(op, instruction)
    }
  })
  const solution2 = registers[0]
  report('Solution 2:', solution2)
}

function testSample ({ before, after, instruction }) {
  const validOperations = operations.map(operation => {
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

run()
