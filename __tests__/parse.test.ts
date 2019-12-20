
import {parseLine} from '../src/parse'

test('parse mypy line', () => {
  const result = parseLine(`bingo/configuration/util.py:56: error: Incompatible return value type (got "bool", expected "str")  [return-value]`)

  expect(result).toBeTruthy()
  if (!result) {
    return
  }

  expect(result.path).toEqual('bingo/configuration/util.py')
  expect(result.line).toEqual(56)
  expect(result.message).toEqual(`error: Incompatible return value type (got "bool", expected "str")`)
})