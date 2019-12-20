import * as core from '@actions/core'

async function run(): Promise<void> {
  console.log('Hello cyber')
}

run().catch(err => {
  core.setFailed(`${err}`)
})
