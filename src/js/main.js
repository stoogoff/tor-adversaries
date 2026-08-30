
import { setLogger, ConsoleLogger, LOG_LEVEL_INFO } from 'q/utils/logger.js'
import { directives } from 'q/reactive/directives.js'
import { eventHandlerDirective } from 'q/reactive/directives/event.js'
import TorAdversary from 'tor/adversary.js'
import TorManager from 'tor/manager.js'
import TorMenu from 'tor/menu.js'
import TorInfo from 'tor/info.js'
import { TOR_LOG_KEY } from 'tor/logger.js'

setLogger(TOR_LOG_KEY, ConsoleLogger, LOG_LEVEL_INFO)

// dangerously set innerHTML
directives.register('html', (context) => {
	context.node.innerHTML = context.value

	context.scope.on(`change:${context.property}`, (key, value, old) => {
		context.node.innerText = value
	})

	return false
})

// add search event which responds to the cross click in chrome
directives.register('search', eventHandlerDirective('search'))

// register components and load
directives.registerComponent('adversary', TorAdversary)
directives.registerComponent('info', TorInfo)
directives.registerComponent('manager', TorManager)
directives.registerComponent('menu', TorMenu)
directives.load(document.body)
