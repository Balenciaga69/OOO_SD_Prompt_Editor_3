import { InputError } from '@/interfaces/inputError.interface'
import _ from 'lodash'
const aBracket = ['(', '[', '{'] as const
const bBracket = [')', ']', '}'] as const
type Bracket = (typeof aBracket)[number]
const pair: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
}
function getInputPairError(text: string): InputError | null {
  const stack: Bracket[] = []
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const prev = i > 0 ? text[i - 1] : ''
    const isNormalChar = prev !== '\\'
    if (!isNormalChar) continue
    if (_.includes(aBracket, char)) {
      stack.push(char as Bracket)
    } else if (_.includes(bBracket, char)) {
      const popped = stack.pop()
      if (!popped) return { i, char, expected: _.findKey(pair, char) ?? 'ERROR_KEY' }
      if (pair[popped] !== char) return { i, char, expected: char }
    }
  }
  if (stack.length > 0) {
    const expected = _.map(stack, (n) => pair[n]).join('')
    return { i: text.length, expected, char: 'EOF' }
  }
  return null
}
function getInputEdgeError(text: string): Omit<InputError, 'expected'> | null {
  const REGEX = /[^,，\\([{\s:|]\s*[([{]|[^\\][\])}]\s*[^,，)\]}\s:|]/
  const result = text.match(REGEX)
  return result ? { i: _.toNumber(result.index), char: result[0] } : null
}
export const codeSyntaxCheckFuncs = { getInputPairError, getInputEdgeError }
