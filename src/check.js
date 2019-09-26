const request = require('./request')

const {
  GITHUB_SHA, GITHUB_EVENT_PATH, GITHUB_TOKEN, GITHUB_ACTION,
} = process.env

console.log(GITHUB_ACTION)

const event = require(GITHUB_EVENT_PATH)
const { repository } = event
const {
  owner: { login: owner },
} = repository
const { name: repo } = repository

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github.antiope-preview+json',
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  'User-Agent': 'docker-lint-action',
}

async function createCheck() {
  const body = {
    name: GITHUB_ACTION,
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
  const body = {
    name: GITHUB_ACTION,
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
