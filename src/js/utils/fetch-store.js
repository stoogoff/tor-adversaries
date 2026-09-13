
import { Emittable } from 'q/utils/emittable.js'
import { logger } from 'tor/logger.js'

export class FetchStore extends Emittable {
	#url = ''
	#data = {}

	constructor(url) {
		super()

		const baseUrl = new URL(import.meta.url)
		const [, versionPath] = baseUrl.pathname.split('/')
		const isVersioned = /^\d+\.\d+\.\d+$/

		if(isVersioned.test(versionPath)) {
			this.#url = [baseUrl.origin, versionPath, url].join('/')
		}
		else {
			this.#url = url
		}
	}

	async load() {
		this._emitter.emit('loading')

		try {
			logger().log('FetchStore', this.#url)

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
		this._emitter.emit('loaded', this.#data)
	}

	get all() {
		return Object.values(this.#data)
	}

	byTitle(title) {
		return title in this.#data ? this.#data[title] : null
	}
}
