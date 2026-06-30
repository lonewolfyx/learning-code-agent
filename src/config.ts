import type { IConfig } from '#/config'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadDotenv } from 'c12'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export const resolveConfig = async (): Promise<IConfig> => {
    const env = await loadDotenv({
        fileName: ['.env', '.env.local'],
        cwd: rootDir,
    })

    return {
        ANTHROPIC_AUTH_TOKEN: env.ANTHROPIC_AUTH_TOKEN!,
        ANTHROPIC_BASE_URL: env.ANTHROPIC_BASE_URL!,
        ANTHROPIC_MODEL: env.ANTHROPIC_MODEL!,
    }
}
