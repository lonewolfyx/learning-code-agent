import type { ContentBlock, Message, MessageParam } from '@anthropic-ai/sdk/resources'
import type { IConfig } from '#/config'
import type { LLMClient } from '@/core/client.ts'
import { writeMessageLog } from '@/core/logger.ts'
import { validateToolsPermission } from '@/tools/permission.ts'

export const printAgentText = (answer: Message): void => {
    for (const content of answer.content as ContentBlock[]) {
        if (content.type === 'text')
            console.log(`agent answer >>> ${content.text}`)
    }
}

export const resolveAgentContent = async (
    messages: MessageParam[],
    client: LLMClient,
    config: IConfig,
    answer: Message,
): Promise<void> => {
    for (const content of answer.content as ContentBlock[]) {
        const type = content.type

        if (type === 'tool_use') {
            // 工具权限判断
            if (!await validateToolsPermission(content, config)) {
                const toolResultMessage: MessageParam = {
                    content: `reject tool use, tools name ${content.name}`,
                    role: 'system',
                }
                messages.push(toolResultMessage)
                await writeMessageLog(config, toolResultMessage)
                continue
            }

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
