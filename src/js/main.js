
import { setLogger, ConsoleLogger, LOG_LEVEL_ERROR } from 'q/utils/logger.js'
import { directives } from 'q/reactive/directives.js'
import TorMenu from 'tor/menu.js'
//import ClockAdd from 'clock/add.js'
//import ClockManager from 'clock/manager.js'
//import ClockView from 'clock/view.js'
import { TOR_LOG_KEY } from 'tor/logger.js'


import { FetchStore } from 'utils/fetch-store.js'


setLogger(TOR_LOG_KEY, ConsoleLogger, LOG_LEVEL_ERROR)


/*const test = async () => {
	const store = new FetchStore('./data/adversaries.json')

	store.on('loading', () => console.log('loading'))
	store.on('loaded', () => console.log('loaded'))

	await store.load()

	console.log(store.all)
}

test()*/


// register custom component
/*directives.register('colour', (context) => {
	context.node.style.backgroundColor = context.value

	return false
})

// register components and load
directives.registerComponent('clock', ClockView)
directives.registerComponent('clock-add', ClockAdd)
directives.registerComponent('clock-manager', ClockManager)*/
directives.registerComponent('menu', TorMenu)
directives.load(document.body)
