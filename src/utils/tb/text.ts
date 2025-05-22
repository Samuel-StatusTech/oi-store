// @ts-ignore
import emoji from "emoji-dictionary"

export const parseEmojis = (text: string) => {
  return text.replace(/:([a-zA-Z0-9_+-]+):/g, (match, name) => {
    const unicodeEmoji = emoji.getUnicode(name)
    return unicodeEmoji || match
  })
}
