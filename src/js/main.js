
import { setLogger, ConsoleLogger, LOG_LEVEL_INFO, LOG_LEVEL_ERROR } from 'q/utils/logger.js'
import { directives } from 'q/reactive/directives.js'
import TorAdversary from 'tor/adversary.js'
import TorManager from 'tor/manager.js'
import TorMenu from 'tor/menu.js'
import TorInfo from 'tor/info.js'
import { TOR_LOG_KEY } from 'tor/logger.js'
import { isVersionedPath } from 'utils/lib.js'

setLogger(TOR_LOG_KEY, ConsoleLogger, isVersionedPath() ? LOG_LEVEL_ERROR : LOG_LEVEL_INFO)

// register components and load
directives.registerComponent('adversary', TorAdversary)
directives.registerComponent('info', TorInfo)
directives.registerComponent('manager', TorManager)
directives.registerComponent('menu', TorMenu)
directives.load(document.body)
