import * as core from '@actions/core'
import * as kit from '@harveyr/github-actions-kit'
import {parseLine} from './parse'
import {MypyIssue} from './types'

interface PostAnnotationArg {
  githubToken: string
  issues: MypyIssue[]
  text: string
}

async function postAnnotations(arg: PostAnnotationArg): Promise<void> {
  core.debug(`Posting ${arg.issues.length} annotations`)

  const {githubToken, issues} = arg
  await kit.postCheckRun({
    githubToken,
    name: 'Mypy',
    conclusion: issues.length ? 'failure' : 'success',
    summary: `${issues.length} issues found`,
    annotations: issues.map(issue => {
      const {path, line, message} = issue
      return {
        level: 'failure',
        startLine: line,
        message,
        path,
      }
    })
  })
}

async function run(): Promise<void> {
  const githubToken = kit.getInputSafe('github_token')

  const patterns = kit.getInputSafe('patterns').split(' ').map(token => {
    return token.trim()
  }).filter(token => {
    return Boolean(token)
  })

  const mypyPath = kit.getInputSafe('mypy_path')
  const args = ['--show-error-codes', '--no-color-output', '--no-error-summary'].concat(patterns)
  const result = await kit.execAndCapture(mypyPath, args, {failOnStdErr: false})

  const text = result.stdout + result.stderr
  const lines = (text).split('\n')
  const issues = lines.map(parseLine).filter(issue => {
    return Boolean(issue)
  }) as MypyIssue[]

  console.log('%s issues found', issues.length)

  if (!githubToken) {
    console.log('No github token provided. Not posting check run.')
    if (issues.length) {
      core.setFailed(`${issues.length} issues found`)
    }
    return
  }

  await postAnnotations({githubToken, issues, text})
}

run().catch(err => {
  core.setFailed(`${err}`)
})
