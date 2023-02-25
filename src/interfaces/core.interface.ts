export interface Prompt {
  id: string
  text: string
  numW: number
  bracketW: number
}
export interface Article {
  id: string
  prompts: Prompt[]
}
export interface CurrentInfo {
  articleID: string
}
