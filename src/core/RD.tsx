/**
 * @description ResourceData
 */
export class RD {
  static AUTHOR = {
    WEB_NAME: '咒語小幫手 v1.0',
    GITHUB_URL: 'https://github.com/Hex-Zhou/SP-09-Prompt-Formatter-React',
    UPDATE_VERSION: '2023/02/28',
  } as const
  static PAGE_LINK = {
    EDITOR_PROMPT: 'editor/prompt',
    EDITOR_ARTICLE: 'editor/article',
    INTRO: 'intro',
    ERROR: 'error',
  } as const
  static STYLE = {
    NAV_BAR: {
      W: 60,
    },
    FOOTER: {
      H: 120,
    },
  }
  static IMG = {
    GITHUB_BLACK: new URL('../assets/image/github-black.svg', import.meta.url).href,
    GITHUB_WHITE: new URL('../assets/image/github-white.svg', import.meta.url).href,
    FACEBOOK: new URL('../assets/image/facebook.svg', import.meta.url).href,
    WIDE_LOGO: new URL('../assets/image/Logo.png', import.meta.url).href,
  } as const
}
