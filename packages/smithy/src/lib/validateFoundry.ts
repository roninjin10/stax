import { exec as execCallback, ExecException } from 'child_process'
import { promisify } from 'util'

const exec = promisify(execCallback)

export const validateFoundry = async (command: string) => {
  try {
    const { stdout } = await exec(command)
    return stdout
  } catch (error: any) {
    const execError = error as ExecException
    if (execError.code === 127) {
      console.error(`Error: ${command} not found in PATH.`)
      console.error(`Please check that you have the Foundry CLI installed.`)
      console.error(
        `Visit https://github.com/foundry-rs/foundry for more information.`,
      )
    } else {
      console.error(`Error: ${command} exited with code ${execError.code}.`)
      console.error(execError.message)
    }
    throw error
  }
}
