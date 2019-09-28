import Octokit from '@octokit/rest'
import { Conclusion } from '../@types/check'

const { GITHUB_SHA, GITHUB_EVENT_PATH, GITHUB_TOKEN } = process.env

if (!GITHUB_EVENT_PATH) {
  throw new Error('GITHUB_EVENT_PATH not defnied')
}

const event = require(GITHUB_EVENT_PATH)
const { repository } = event
const {
  owner: { login: owner },
} = repository
const { name: repo } = repository

const checkName = 'Docker Lint Check'

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})

async function createCheck() {
  if (!GITHUB_SHA) {
    throw new Error('SHA is not defined')
  }

  const check = await octokit.checks.create({
    owner,
    repo,
    head_sha: GITHUB_SHA,
    name: checkName,
    status: 'in_progress',
    started_at: new Date().toString(),
  })
  return check.data.id
}

async function updateCheck(id : number,
  conclusion : Conclusion, output : Octokit.ChecksUpdateParamsOutput | undefined = undefined) {
  const arg : Octokit.RequestOptions & Octokit.ChecksUpdateParams = {
    owner,
    repo,
    check_run_id: id,
    status: 'completed',
    completed_at: new Date().toString(),
    conclusion,
  }

  if (output) {
    arg.output = output
  }

  await octokit.checks.update(arg)
}

export { updateCheck, createCheck }
