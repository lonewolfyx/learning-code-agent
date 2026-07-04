import type { MessageParam } from '@anthropic-ai/sdk/resources'
import type { Interface } from 'node:readline/promises'
import type { LLMClient } from '@/core/client.ts'

export interface IConfig {
    ANTHROPIC_AUTH_TOKEN: string
    ANTHROPIC_BASE_URL: string
    ANTHROPIC_MODEL: string
    readonly readline: Interface
    messages: MessageParam[]
    sessionId: string
}

export interface IOptions {
    input: string
    config: IConfig
    readonly client: LLMClient
}
