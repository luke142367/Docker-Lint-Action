const { exec } = require('child_process')

module.exports = async (cmd) => new Promise((resolve, reject) => {
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      if (err.code === 2) {
        resolve({ stdout, stderr })
      } else {
        reject(err)
      }
    } else {
      resolve({ stdout, stderr })
    }
  })
})
