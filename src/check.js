const request = require('./request')

const { GITHUB_SHA, GITHUB_EVENT_PATH, GITHUB_TOKEN } = process.env
const event = require(GITHUB_EVENT_PATH)
const { repository } = event
const {
  owner: { login: owner },
} = repository
const { name: repo } = repository

const checkName = 'Docker Lint Check'

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github.antiope-preview+json',
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  'User-Agent': 'docker-lint-action',
}

async function createCheck() {
  const body = {
    name: checkName,
    head_sha: GITHUB_SHA,
    status: 'in_progress',
    started_at: new Date(),
  }

  const { data } = await request(`https://api.github.com/repos/${owner}/${repo}/check-runs`, {
    method: 'POST',
    headers,
    body,
  })
  const { id } = data
  return id
}

async function updateCheck(id, conclusion, output) {
  output.annotations.forEach((a) => {
    console.log(a)
    console.log(typeof a.start_line)
  })
  const body = {
    name: checkName,
    head_sha: GITHUB_SHA,
    status: 'completed',
    completed_at: new Date(),
    conclusion,
    output,
  }

  await request(`https://api.github.com/repos/${owner}/${repo}/check-runs/${id}`, {
    method: 'PATCH',
    headers,
    body,
  })
}

module.exports = {
  createCheck,
  updateCheck,
}
