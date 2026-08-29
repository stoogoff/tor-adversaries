
import { setLogger, ConsoleLogger, LOG_LEVEL_INFO } from 'q/utils/logger.js'
import { directives } from 'q/reactive/directives.js'
import TorMenu from 'tor/menu.js'
import TorInfo from 'tor/info.js'
import { TOR_LOG_KEY } from 'tor/logger.js'

setLogger(TOR_LOG_KEY, ConsoleLogger, LOG_LEVEL_INFO)



// register custom component
/*directives.register('colour', (context) => {
	context.node.style.backgroundColor = context.value

	return false
})*/

// register components and load
directives.registerComponent('info', TorInfo)
directives.registerComponent('menu', TorMenu)
directives.load(document.body)
