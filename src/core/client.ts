import type { Message, MessageParam, ToolResultBlockParam, ToolUseBlock } from '@anthropic-ai/sdk/resources'
import type { IConfig } from '#/config'
import type { toolHandlerNames } from '#/tools'
import { Anthropic } from '@anthropic-ai/sdk'
import { rootDir } from '@/constant.ts'
import { tools, toolsHandler } from '@/tools'

const DEFAULT_MAX_TOKENS = 8192

const isToolName = (name: string): name is toolHandlerNames => name in toolsHandler

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
            tools,
            max_tokens: this.maxTokens,
            system: `You are a coding agent at ${rootDir}, use tools to solve tasks. Act, don't explain.`,
            messages,
            model: this.model,
        })
    }

    async runTools(toolUse: ToolUseBlock): Promise<ToolResultBlockParam> {
        const toolsName = toolUse.name
        if (!isToolName(toolsName)) {
            return {
                content: `Unknown tool: ${toolsName}`,
                is_error: true,
                tool_use_id: toolUse.id,
                type: 'tool_result',
            }
        }

        const result = await toolsHandler[toolsName]!(toolUse.input as any)

        return {
            content: result.content,
            is_error: result.isError,
            tool_use_id: toolUse.id,
            type: 'tool_result',
        }
    }
}
