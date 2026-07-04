import { bashTools, runBashHandler } from '@/tools/bash.ts'

export const tools = [
    bashTools,
]

export const toolsHandler = {
    bash: runBashHandler,
}
