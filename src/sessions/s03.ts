import { resolveConfig } from '@/config.ts'
import { runAgentLoop } from '@/core/agent-loop.ts'
import { LLMClient } from '@/core/client.ts'
import { isExitCommand } from '@/shared/utils.ts'

async function main(): Promise<void> {
    const config = await resolveConfig()
    const client = new LLMClient(config)

    try {
        while (true) {
            let input: string

            try {
                input = await config.readline.question('S03 >>> ')
            }
            catch {
                break
            }

            if (!input.trim())
                continue

            if (isExitCommand(input)) {
                break
            }

            await runAgentLoop({
                input,
                config,
                client,
            })
        }
    }
    finally {
        config.readline.close()
    }
}

void main()
