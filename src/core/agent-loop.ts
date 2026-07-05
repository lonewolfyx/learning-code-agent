import type { MessageParam } from '@anthropic-ai/sdk/resources'
import type { IOptions } from '#/config'
import { printAgentText, resolveAgentContent } from '@/core/core.ts'
import { writeMessageLog } from '@/core/logger.ts'

export const runAgentLoop = async (options: IOptions): Promise<void> => {
    const { input, client, config } = options
    const messages = config.messages

    if (!input)
        return

    const userMessage: MessageParam = {
        content: input,
        role: 'user',
    }

    messages.push(userMessage)
    await writeMessageLog(config, userMessage)

    try {
        while (true) {
            const answer = await client.chat(messages)

            console.log(answer)

            const assistantMessage: MessageParam = {
                content: answer.content,
                role: 'assistant',
            }

            messages.push(assistantMessage)
            await writeMessageLog(config, assistantMessage)

            printAgentText(answer)

            // 非 tool_use 退出循环
            if (answer.stop_reason !== 'tool_use')
                break

            // 处理 agent 返回的内容
            await resolveAgentContent(messages, client, config, answer)
        }
    }
    catch (error) {
        messages.pop()
        console.error(`请求失败：${error}`)
    }
}
