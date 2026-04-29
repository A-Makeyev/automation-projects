export const cleanText = (text: string) => {
    return text
        .replace(/\[\d+\]|-|[^\p{L}\p{N}\s]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    }

export const arrayToString = (array: string[]) => {
        let result = ''

        for (let i = 0; i < array.length; i++) {
            if (i > 0) {
                result += ' '
            }
            result += array[i]
        }

        return result
    }