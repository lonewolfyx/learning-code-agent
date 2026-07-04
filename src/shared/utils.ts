import { v4 as uuid4 } from 'uuid'

export const createSessionId = (): string => uuid4()
