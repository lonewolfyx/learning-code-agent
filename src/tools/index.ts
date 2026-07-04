import { bashTools, runBashHandler } from '@/tools/bash.ts'
import { runWriteFileHandler, writeFileTools } from '@/tools/write.file.ts'

export const tools = [
    bashTools,
    writeFileTools,
]

export const toolsHandler = {
    bash: runBashHandler,
    writeFile: runWriteFileHandler,
}
