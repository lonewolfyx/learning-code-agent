import type { Message, MessageParam } from '@anthropic-ai/sdk/resources'
import type { IConfig } from '#/config'
import { Anthropic } from '@anthropic-ai/sdk'
import { rootDir } from '@/constant.ts'
import { tools } from '@/tools'

const DEFAULT_MAX_TOKENS = 8192

export class LLMClient {
    private readonly client: Anthropic
    private readonly maxTokens = DEFAULT_MAX_TOKENS
    private readonly model: string
    // private readonly conf: IConfig

    constructor(config: IConfig) {
        // this.conf = config
        this.client = new Anthropic({
            apiKey: config.ANTHROPIC_AUTH_TOKEN,
            baseURL: config.ANTHROPIC_BASE_URL,
        })
        this.model = config.ANTHROPIC_MODEL
    }

    async chat(messages: MessageParam[]): Promise<Message> {
        return this.client.messages.create({
            // tools: this.conf.tools,
            tools,
            max_tokens: this.maxTokens,
            system: `You are a coding agent at ${rootDir}, use tools to solve tasks. Act, don't explain.`,
            messages,
            model: this.model,
        })
    }
}
