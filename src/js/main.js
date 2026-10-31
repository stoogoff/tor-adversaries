
import { setLogger, ConsoleLogger, LOG_LEVEL_INFO, LOG_LEVEL_ERROR } from 'q/utils/logger.js'
import { directives } from 'q/reactive/directives.js'
import CreateForm from 'create/form.js'
import CreateAbilityFilter from 'create/ability-filter.js'
import CreateAttacks from 'create/attacks.js'
import TorAdversary from 'tor/adversary.js'
import TorInfo from 'tor/info.js'
import TorManager from 'tor/manager.js'
import TorMenu from 'tor/menu.js'
import TorTopMenu from 'tor/top-menu.js'
import { TOR_LOG_KEY } from 'tor/logger.js'
import { isVersionedPath } from 'utils/lib.js'

import { DIRECTIVES_LOG_KEY } from 'q/reactive/config.js'

//setLogger(DIRECTIVES_LOG_KEY, ConsoleLogger, LOG_LEVEL_INFO)
setLogger(TOR_LOG_KEY, ConsoleLogger, isVersionedPath() ? LOG_LEVEL_ERROR : LOG_LEVEL_INFO)

// register create form components
directives.registerComponent('form', CreateForm)
directives.registerComponent('ability-filter', CreateAbilityFilter)
directives.registerComponent('attacks', CreateAttacks)

// register TOR display components
directives.registerComponent('adversary', TorAdversary)
directives.registerComponent('info', TorInfo)
directives.registerComponent('manager', TorManager)
directives.registerComponent('menu', TorMenu)
directives.registerComponent('top-menu', TorTopMenu)

// load
directives.load(document.body)
