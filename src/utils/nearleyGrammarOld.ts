/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable lodash/prefer-constant */
/* eslint-disable lodash/prefer-lodash-method */
/* eslint-disable @typescript-eslint/ban-ts-comment */

// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
  return d[0]
}

interface NearleyToken {
  value: any
  [key: string]: any
}

interface NearleyLexer {
  reset: (chunk: string, info: any) => void
  next: () => NearleyToken | undefined
  save: () => any
  formatError: (token: never) => string
  has: (tokenType: string) => boolean
}

interface NearleyRule {
  name: string
  symbols: NearleySymbol[]
  postprocess?: (d: any[], loc?: number, reject?: {}) => any
}

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean }

interface Grammar {
  Lexer: NearleyLexer | undefined
  ParserRules: NearleyRule[]
  ParserStart: string
}

export const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    { name: 'Prompt$ebnf$1', symbols: [] },
    { name: 'Prompt$ebnf$1$subexpression$1', symbols: ['SinglePrompt', /[,，]/] },
    { name: 'Prompt$ebnf$1', symbols: ['Prompt$ebnf$1', 'Prompt$ebnf$1$subexpression$1'], postprocess: (d) => d[0].concat([d[1]]) },
    { name: 'Prompt', symbols: ['Prompt$ebnf$1', 'SinglePrompt'], postprocess: ([c, t]) => [...c.map((n: any[]) => n[0]), t] },
    { name: 'SinglePrompt', symbols: ['Plain'], postprocess: id },
    { name: 'SinglePrompt', symbols: ['WhitespaceWrapped'], postprocess: id },
    { name: 'SinglePrompt', symbols: ['_'], postprocess: () => null },
    { name: 'WhitespaceWrapped$subexpression$1', symbols: ['Emphasized'], postprocess: id },
    { name: 'WhitespaceWrapped$subexpression$1', symbols: ['Editing'], postprocess: id },
    { name: 'WhitespaceWrapped$subexpression$1', symbols: ['Alternate'], postprocess: id },
    { name: 'WhitespaceWrapped', symbols: ['_', 'WhitespaceWrapped$subexpression$1', '_'], postprocess: ([, d]) => d },
    { name: 'Emphasized', symbols: [{ literal: '(' }, 'Prompt', { literal: ')' }], postprocess: ([, c]) => ({ type: 'weight_add', content: c }) },
    { name: 'Emphasized', symbols: [{ literal: '(' }, 'Prompt', { literal: ':' }, 'Number', { literal: ')' }], postprocess: ([, c, , w]) => ({ type: 'weight_set', content: c, weight: w }) },
    { name: 'Emphasized', symbols: [{ literal: '[' }, 'Prompt', { literal: ']' }], postprocess: ([, c]) => ({ type: 'weight_sub', content: c }) },
    { name: 'Editing$ebnf$1$subexpression$1', symbols: ['Prompt', { literal: ':' }] },
    { name: 'Editing$ebnf$1', symbols: ['Editing$ebnf$1$subexpression$1'], postprocess: id },
    { name: 'Editing$ebnf$1', symbols: [], postprocess: () => null },
    { name: 'Editing', symbols: [{ literal: '[' }, 'Editing$ebnf$1', 'Prompt', { literal: ':' }, 'Number', { literal: ']' }], postprocess: ([, a, b, , w]) => ({ type: 'editing', from: a?.[0] ?? null, to: b, breakpoint: w }) },
    { name: 'Alternate$ebnf$1$subexpression$1', symbols: [{ literal: '|' }, 'Prompt'] },
    { name: 'Alternate$ebnf$1', symbols: ['Alternate$ebnf$1$subexpression$1'] },
    { name: 'Alternate$ebnf$1$subexpression$2', symbols: [{ literal: '|' }, 'Prompt'] },
    { name: 'Alternate$ebnf$1', symbols: ['Alternate$ebnf$1', 'Alternate$ebnf$1$subexpression$2'], postprocess: (d) => d[0].concat([d[1]]) },
    { name: 'Alternate', symbols: [{ literal: '[' }, 'Prompt', 'Alternate$ebnf$1', { literal: ']' }], postprocess: ([, a, b]) => ({ type: 'alternate', tags: [a, ...b.map((n: any[]) => n[1])] }) },
    { name: 'Plain$ebnf$1', symbols: ['Char'] },
    { name: 'Plain$ebnf$1', symbols: ['Plain$ebnf$1', 'Char'], postprocess: (d) => d[0].concat([d[1]]) },
    {
      name: 'Plain',
      symbols: ['Plain$ebnf$1'],
      postprocess: ([c], l, r) =>
        c.join('').trim() === ''
          ? null
          : {
              type: 'tag',
              name: c
                .join('')
                .replace(/[  \t\n\v\f]/g, ' ')
                .trim(),
            },
    },
    { name: 'Char', symbols: [/[^\\\[\]():|,，]/], postprocess: id },
    { name: 'Char$string$1', symbols: [{ literal: '\\' }, { literal: '(' }], postprocess: (d) => d.join('') },
    { name: 'Char', symbols: ['Char$string$1'], postprocess: () => '(' },
    { name: 'Char$string$2', symbols: [{ literal: '\\' }, { literal: ')' }], postprocess: (d) => d.join('') },
    { name: 'Char', symbols: ['Char$string$2'], postprocess: () => ')' },
    { name: 'Char$string$3', symbols: [{ literal: '\\' }, { literal: '[' }], postprocess: (d) => d.join('') },
    { name: 'Char', symbols: ['Char$string$3'], postprocess: () => '[' },
    { name: 'Char$string$4', symbols: [{ literal: '\\' }, { literal: ']' }], postprocess: (d) => d.join('') },
    { name: 'Char', symbols: ['Char$string$4'], postprocess: () => ']' },
    { name: 'Number', symbols: ['_', 'unsigned_decimal', '_'], postprocess: ([, d]) => d },
    { name: '_$ebnf$1', symbols: [] },
    { name: '_$ebnf$1', symbols: ['_$ebnf$1', 'wschar'], postprocess: (d) => d[0].concat([d[1]]) },
    {
      name: '_',
      symbols: ['_$ebnf$1'],
      postprocess: function (d) {
        return null
      },
    },
    { name: 'wschar', symbols: [/[  \t\n\v\f]/], postprocess: id },
    { name: 'unsigned_decimal$ebnf$1', symbols: [/[0-9]/] },
    { name: 'unsigned_decimal$ebnf$1', symbols: ['unsigned_decimal$ebnf$1', /[0-9]/], postprocess: (d) => d[0].concat([d[1]]) },
    { name: 'unsigned_decimal$ebnf$2$subexpression$1$ebnf$1', symbols: [/[0-9]/] },
    { name: 'unsigned_decimal$ebnf$2$subexpression$1$ebnf$1', symbols: ['unsigned_decimal$ebnf$2$subexpression$1$ebnf$1', /[0-9]/], postprocess: (d) => d[0].concat([d[1]]) },
    { name: 'unsigned_decimal$ebnf$2$subexpression$1', symbols: [{ literal: '.' }, 'unsigned_decimal$ebnf$2$subexpression$1$ebnf$1'] },
    { name: 'unsigned_decimal$ebnf$2', symbols: ['unsigned_decimal$ebnf$2$subexpression$1'], postprocess: id },
    { name: 'unsigned_decimal$ebnf$2', symbols: [], postprocess: () => null },
    {
      name: 'unsigned_decimal',
      symbols: ['unsigned_decimal$ebnf$1', 'unsigned_decimal$ebnf$2'],
      postprocess: function (d) {
        return parseFloat(d[0].join('') + (d[1] ? '.' + d[1][1].join('') : ''))
      },
    },
  ],
  ParserStart: 'Prompt',
}
