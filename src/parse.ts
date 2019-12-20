import { MypyIssue } from './types'

const LINE_REGEXP = /^([\S^:]+):(\d+): (.+) \[([a-z-]+)\]$/

export function parseLine(line: string): MypyIssue | null {
  const match = LINE_REGEXP.exec(line)
  if (!match || match.length < 3) {
    console.log('Unmatched line: %s', line)
    return null
  }

  return {
    path: match[1],
    line: parseInt(match[2], 10),
    message: match[3].trim(),
    code: match[4],
  }
}
