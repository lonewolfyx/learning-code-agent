import type { IConfig } from '#/config'
import * as readline from 'node:readline/promises'
import { loadDotenv } from 'c12'
import { rootDir } from '@/constant.ts'
import { createSessionId } from '@/shared/utils.ts'

export const resolveConfig = async (): Promise<IConfig> => {
    const env = await loadDotenv({
        fileName: ['.env', '.env.local'],
        cwd: rootDir,
    })

    return {
        ANTHROPIC_AUTH_TOKEN: env.ANTHROPIC_AUTH_TOKEN!,
        ANTHROPIC_BASE_URL: env.ANTHROPIC_BASE_URL!,
        ANTHROPIC_MODEL: env.ANTHROPIC_MODEL!,
        readline: readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        }),
        messages: [],
        sessionId: createSessionId(),
    }
}
