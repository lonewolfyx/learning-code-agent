import { v4 as uuid4 } from 'uuid'

export const createSessionId = (): string => uuid4()

export const isExitCommand = (input: string): boolean => {
    return ['exit', 'quit', 'q'].includes(input.trim().toLowerCase())
}
