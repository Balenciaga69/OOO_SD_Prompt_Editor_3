export class BP {
  static ENV = {
    WEB_NAME: '咒語小幫手 v1.0',
    GITHUB_URL: 'https://github.com/Hex-Zhou/SP-09-Prompt-Formatter-React',
    UPDATE_VERSION: '23-02-12',
  } as const
  static LINK_LIST = {} as const
  static IMG = {
    GITHUB_BLACK: new URL('../assets/image/github-black.svg', import.meta.url).href,
    GITHUB_WHITE: new URL('../assets/image/github-white.svg', import.meta.url).href,
    FACEBOOK: new URL('../assets/image/facebook.svg', import.meta.url).href,
    LOGO_LONG: new URL('../assets/image/Logo.png', import.meta.url).href,
  } as const
}
