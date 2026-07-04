import type { Tool } from '@anthropic-ai/sdk/resources'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import * as z from 'zod'

export const writeFileType = z.object({
    path: z.string(),
    content: z.string(),
})

export const runWriteFileHandler = (input: z.infer<typeof writeFileType>): Promise<any> => {
    const { path, content } = input
    return new Promise((resolve) => {
        mkdirSync(dirname(path), { recursive: true })
        writeFileSync(path, content, 'utf-8')

        resolve({
            content: `write path: ${path}, content: ${content}`,
            isError: false,
        })
    })
}

export const writeFileTools = {
    name: 'writeFile',
    description: 'Write content to file.',
    input_schema: z.toJSONSchema(writeFileType) as Tool.InputSchema,
}
