import type { ToolUseBlock } from '@anthropic-ai/sdk/resources'
import type * as z from 'zod'
import type { IConfig } from '#/config'
import type { bashCommand } from '@/tools/bash.ts'
import type { writeFileType } from '@/tools/write.file.ts'

const DENY_LIST = [
    'rm -rf /',
    'sudo',
    'shutdown',
    'reboot',
    'mkfs',
    'dd if=',
    '> /dev/sda',
]

const NEED_CONFIRM_TOOLS = [
    'writeFile',
]

const ALLOW_ANSWERS = [
    'y',
    'yes',
    '是',
    '允许',
    '同意',
]

const isAllowAnswer = (answer: string): boolean => {
    return ALLOW_ANSWERS.includes(answer.trim().toLowerCase())
}

const createConfirmMessage = (toolUse: ToolUseBlock): string => {
    if (toolUse.name === 'writeFile') {
        const { path, content } = toolUse.input as z.infer<typeof writeFileType>
        return `是否允许执行 writeFile？path: ${path}, content length: ${content.length} (y/N) `
    }

    return `是否允许执行工具 ${toolUse.name}？(y/N) `
}

export const validateToolsPermission = async (toolUse: ToolUseBlock, config: IConfig): Promise<boolean> => {
    // 如果是 bash 工具执行，判断执行的命令是否允许
    if (toolUse.name === 'bash') {
        if (DENY_LIST.some(deny => (toolUse.input as z.infer<typeof bashCommand>).command.includes(deny))) {
            console.log('[deny]', toolUse, '禁止')
            return false
        }
    }

    if (NEED_CONFIRM_TOOLS.includes(toolUse.name)) {
        const isAllow = isAllowAnswer(await config.readline.question(createConfirmMessage(toolUse)))
        if (!isAllow) {
            console.log('[deny]', toolUse, '用户拒绝')
            return false
        }
    }

    return true
}
