const { exec } = require('child_process')

module.exports = async (cmd) => new Promise((resolve) => {
  exec(cmd, (err, stdout, stderr) => {
    resolve({ err, stdout, stderr })
  })
})
