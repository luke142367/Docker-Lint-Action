import { exec, ExecException } from 'child_process'

interface ExecResult {
  err: ExecException | null
  stdout: string
  stderr: string
}

export default async (cmd : string) => new Promise<ExecResult>((resolve) => {
  exec(cmd, (err, stdout, stderr) => {
    resolve({ err, stdout, stderr })
  })
})
