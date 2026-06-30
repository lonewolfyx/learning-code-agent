import { loadConfig } from 'c12'

export const resolveConfig = async () => {
    const { config } = await loadConfig({
        name: 'agent-config',
        dotenv: true,
    })
    return config
}
