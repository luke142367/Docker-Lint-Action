const Octokit = require('@octokit/rest')

const { GITHUB_SHA, GITHUB_EVENT_PATH, GITHUB_TOKEN } = process.env
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
  const check = await octokit.checks.create({
    owner,
    repo,
    name: checkName,
    head_sha: GITHUB_SHA,
    status: 'in_progress',
    started_at: new Date(),
  })
  console.log(check)
  console.log(check.id)
  return check.id
}

async function updateCheck(id, conclusion, output) {
  await octokit.checks.update({
    owner,
    repo,
    check_run_id: id,
    status: 'completed',
    completed_at: new Date(),
    conclusion,
    output,
  })
}

module.exports = {
  createCheck,
  updateCheck,
}
