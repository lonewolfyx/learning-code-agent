import type { ContentBlock, Message, MessageParam } from '@anthropic-ai/sdk/resources'
import type { IConfig } from '#/config'
import type { LLMClient } from '@/core/client.ts'
import { writeMessageLog } from '@/core/logger.ts'

export const resolveAgentContent = async (
    messages: MessageParam[],
    client: LLMClient,
    config: IConfig,
    answer: Message,
): Promise<void> => {
    for (const content of answer.content as ContentBlock[]) {
        const type = content.type

        if (type === 'text') {
            console.log(`agent answer >>> ${content.text}`)
        }

        if (type === 'tool_use') {
            const toolResult = await client.runTools(content)

            const toolResultMessage: MessageParam = {
                content: toolResult.content as any,
                role: 'user',
            }

            messages.push(toolResultMessage)
            await writeMessageLog(config, toolResultMessage)
        }
    }
}
