const { INPUT_TARGET } = process.env
const { createCheck, updateCheck } = require('./check')
const exec = require('./exec')

const checkName = 'Docker Lint Check'

const dockerLint = async () => {
  const { stdout } = await exec(`dockerfilelint ${INPUT_TARGET} -j`)
  const result = JSON.parse(stdout)
  const { files, totalIssues } = result

  const levels = ['', 'warning', 'failure']

  const annotations = []
  files.forEach((file) => {
    const { issues } = file
    const path = file.file
    issues.forEach((issue) => {
      const {
        line, category, title, content,
      } = issue
      const annotationLevel = levels[2]
      annotations.push({
        path,
        start_line: parseInt(line, 10),
        end_line: parseInt(line, 10),
        start_column: 0,
        end_column: content.length - 1,
        annotation_level: annotationLevel,
        message: `[${category}] ${title}`,
      })
    })
  })

  return {
    conclusion: parseInt(totalIssues, 10) > 0 ? 'failure' : 'success',
    output: {
      title: checkName,
      summary: `${totalIssues} issue(s) found`,
      annotations,
      text: `
      ## Docker Lint
      ### Issues
      ${totalIssues} issue(s) found
      `,
    },
  }
}

function exitWithError(err) {
  console.error('Error', err.stack)
  if (err.data) {
    console.error(err.data)
  }
  process.exit(1)
}

async function run() {
  const id = await createCheck()
  try {
    const { conclusion, output } = await dockerLint()
    console.log(output.summary)
    await updateCheck(id, conclusion, output)
    if (conclusion === 'failure') {
      process.exit(78)
    }
  } catch (err) {
    await updateCheck(id, 'failure')
    exitWithError(err)
  }
}

run().catch(exitWithError)
