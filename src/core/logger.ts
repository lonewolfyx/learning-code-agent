import type { MessageParam } from '@anthropic-ai/sdk/resources'
import type { IConfig } from '#/config'
import { appendFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { rootDir } from '@/constant.ts'

export const writeMessageLog = async (
    config: IConfig,
    message: MessageParam,
): Promise<void> => {
    const record = {
        message,
        messageIndex: config.messages.length - 1,
        sessionId: config.sessionId,
        timestamp: new Date().toISOString(),
    }
    const logDir = resolve(rootDir, 'log')

    await mkdir(logDir, { recursive: true })
    await appendFile(resolve(logDir, `${config.sessionId}.jsonl`), `${JSON.stringify(record)}\n`, 'utf8')
}
