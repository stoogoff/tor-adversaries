
import { getLogger } from 'q/utils/logger.js'

export const TOR_LOG_KEY = 'TOR'

export const logger = () => getLogger(TOR_LOG_KEY)
