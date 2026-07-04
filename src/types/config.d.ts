import type { Interface } from 'node:readline'

export interface IConfig {
    ANTHROPIC_AUTH_TOKEN: string
    ANTHROPIC_BASE_URL: string
    ANTHROPIC_MODEL: string
    readonly readline: Interface
}
