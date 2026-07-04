import type { Tool } from '@anthropic-ai/sdk/resources'
import { exec } from 'node:child_process'
import * as z from 'zod'
import { rootDir } from '@/constant.ts'

const bashCommand = z.object({
    command: z.string().describe('The shell command to run.'),
})

export const runBashHandler = async (input: z.infer<typeof bashCommand>): Promise<any> => {
    const { command } = input

    return new Promise((resolve) => {
        exec(command, {
            cwd: rootDir,
            maxBuffer: 1024 * 1024 * 10,
            timeout: 30_000,
        }, (error, stdout, stderr) => {
            const content = [
                `$ ${command}`,
                stdout ? `stdout:\n${stdout}` : '',
                stderr ? `stderr:\n${stderr}` : '',
                error ? `error:\n${error.message}` : '',
            ].filter(Boolean).join('\n\n')

            resolve({
                content: content || '[empty output]',
                isError: Boolean(error),
            })
        })
    })
}

export const bashTools = {
    name: 'bash',
    description: 'Run a shell command',
    input_schema: z.toJSONSchema(bashCommand) as Tool.InputSchema,
}
