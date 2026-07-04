import type { Tool } from '@anthropic-ai/sdk/resources'
import * as z from 'zod'

export const bashTools = {
    name: 'bash',
    description: 'Run a shell command',
    input_schema: z.toJSONSchema(z.object({
        command: z.string().describe('The shell command to run.'),
    })) as Tool.InputSchema,
}
