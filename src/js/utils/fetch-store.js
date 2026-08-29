
import { Emitter } from 'q/utils/emitter.js'
import { logger } from 'tor/logger.js'

export class FetchStore {
	#url = ''
	#emitter
	#data = {}

	constructor(url) {
		this.#url = url
		this.#emitter = new Emitter()
	}

	async load() {
		this.#emitter.emit('loading')

		try {
			const data = await fetch(this.#url)

			logger().log('FetchStore', data)

			const json = await data.json()

			json.forEach(item => {
				this.#data[item.title] = item
			})
		}
		catch(err) {
			logger().error('FetchStore', err)
		}

		logger().log('FetchStore', this.#data)
		this.#emitter.emit('loaded', this.#data)
	}

	get all() {
		return Object.values(this.#data)
	}

	byTitle(title) {
		return title in this.#data ? this.#data[title] : null
	}

	// Emitter methods

	on(event, callback) {
		return this.#emitter.on(event, callback)
	}

	off(event, reference) {
		return this.#emitter.off(event, reference)
	}

	clear() {
		this.#emitter.clear()
	}
}
