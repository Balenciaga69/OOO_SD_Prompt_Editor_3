import { codeSyntaxCheckFuncs } from '@/utils/codeCheck'
import { doNotUseThisFunctionBeCuzThisFunctionIsBeDeprected } from '@/utils/parser'

/**
 * @description ResourceData
 */
export class RD {
  static AUTHOR = {
    WEB_NAME: '咒語助手 v1.0',
    GITHUB_URL: 'https://github.com/emilioCodigo/GK-01-ProperSwitch',
    UPDATE_VERSION: '2023/02/28',
    AUTHOR_NAME: 'Emilio Gonzales',
  } as const
  static PAGE_LINK = {
    TAG: 'tag',
    TAG_VISUAL: 'tag#visual',
    TAG_EDITOR: 'tag#editor',
    INTRO: 'intro',
    ERROR: 'error',
  } as const
  static STYLE = {
    NAV_BAR: {
      W: 50,
    },
    FOOTER: {
      H: 120,
    },
  }
  static FUNCS = {
    CODE_SYNTAX_CHECK: codeSyntaxCheckFuncs,
  } as const
  static LOCAL_STORAGE_KEY = {
    REDUX: 'REDUX',
  } as const

  static IMG = {
    GITHUB_BLACK: new URL('../assets/image/github-black.svg', import.meta.url).href,
    GITHUB_WHITE: new URL('../assets/image/github-white.svg', import.meta.url).href,
    FACEBOOK: new URL('../assets/image/facebook.svg', import.meta.url).href,
    WIDE_LOGO: new URL('../assets/image/Logo.png', import.meta.url).href,
  } as const
}
