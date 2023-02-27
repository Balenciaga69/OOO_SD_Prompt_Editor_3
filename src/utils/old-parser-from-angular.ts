import { Tag } from '@/interfaces/core.interface'
import _ from 'lodash'
const formatString = (code: string) => {
  let isReplaceFinished = false
  let result = code
  while (!isReplaceFinished) {
    const before = result
    result = _.replace(result, / {2}|\n| \[|\] |{(?!\()|}(?!\))/g, (match) => {
      switch (match) {
        case '  ':
          return ' '
        case '\n':
        case ' [':
          return ''
        case '] ':
          return ']'
        case '{':
          return '('
        case '}':
          return ')'
        default:
          return match
      }
    })
    result = _.replace(result, / ,+/g, ',')
    result = _.trim(result)
    if (before === result) isReplaceFinished = true
  }
  return result
}
type Bracket = ')' | ']'
export const simpleTagParserFromAngular = (input: string): Omit<Tag, 'id'>[] => {
  const code = formatString(input)
  const tempList: Omit<Tag, 'id'>[] = []
  let endPos = -1
  let stack: Bracket[] = []
  for (let i = code.length - 1; i > -1; i--) {
    if (endPos === -1) endPos = i
    if (code[i] === ')') {
      stack.push(code[i] as Bracket)
    }
    if (code[i] === ']') {
      stack.push(code[i] as Bracket)
    }
    if (code[i] === '(') {
      if (stack[stack.length - 1] === ')') {
        stack.pop()
      }
    }
    if (code[i] === '[') {
      if (stack[stack.length - 1] === ']') {
        stack.pop()
      }
    }
    // 字串處理完後 關鍵詞判別
    if ((code[i] === ',' || i === 0) && stack.length === 0) {
      tempList.push(generateTag(code, i, endPos))
      endPos = -1
      stack = []
      continue
    }
  }
  return _.filter(_.reverse(tempList), (tag) => !_.isEmpty(tag.title))
}
const generateTag = _.flow([
  (code: string, start: number, end: number) => {
    if (code[start] === ',') start++
    const bracketWeight = 0
    return { code, start, end, bracketWeight }
  },
  ({ code, start, end, bracketWeight }) => {
    let calcDone = false
    while (!calcDone) {
      const startStr = code[start]
      const endStr = code[end]
      if (startStr === '(' && endStr === ')' && bracketWeight >= 0) {
        start++
        end--
        bracketWeight++
      } else if (startStr === '[' && endStr === ']' && bracketWeight <= 0) {
        start++
        end--
        bracketWeight--
      } else {
        calcDone = true
      }
    }
    return { code, start, end, bracketWeight }
  },
  ({ code, start, end, bracketWeight }) => {
    let numberWeight = 1
    let currentPosition = end
    while (bracketWeight === 1) {
      if (code[currentPosition] === ':') {
        const t = code.substring(currentPosition + 1, end + 1)
        if (!isNaN(Number(t))) {
          numberWeight = Number(t)
          end = currentPosition - 1
          break
        }
      }
      if (currentPosition <= start) break
      currentPosition--
    }
    if (numberWeight !== 1) bracketWeight = 0
    const title = code.substring(start, end + 1)
    return { bracketWeight, numberWeight, title }
  },
  ({ bracketWeight, numberWeight, title }) => ({ bracketWeight, numberWeight, title } as Omit<Tag, 'id'>),
])

export const simpleTagsToCode = (tags: Tag[], mode: 'split' | 'zip' = 'zip') => {
  let finalResult = ''
  _.forEach(tags, (e, i) => {
    let tagStr = _.trim(e.title)
    let bracketWeight = e.bracketWeight
    // * * * * * 括號權重 * * * * *
    while (bracketWeight !== 0) {
      if (bracketWeight > 0) {
        tagStr = `(${tagStr})`
        bracketWeight--
      } else {
        tagStr = `[${tagStr}]`
        bracketWeight++
      }
    }
    // * * * * * 數字權重 * * * * *
    if (e.numberWeight !== 1) {
      tagStr = `(${tagStr}:${e.numberWeight})`
    }
    // * * * * * 末位逗點 * * * * *
    finalResult = finalResult + tagStr
    if (i < tags.length - 1) {
      finalResult += ','
      // * * * * * 分隔模式 或 壓縮模式 * * * * *
      if (mode === 'split') {
        finalResult += '\n'
      }
    }
  })
  return finalResult
}
