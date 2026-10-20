
import { Emittable } from 'q/utils/emittable.js'
import { logger } from 'tor/logger.js'
import { isVersionedPath, versionedPath } from 'utils/lib.js'
import { Events } from 'utils/config.js'

export class FetchStore extends Emittable {
	#url = ''
	#data = {}
	#key = ''

	constructor(url, key = 'title') {
		super()

		this.#key = key

		if(isVersionedPath()) {
			const { baseUrl, versionPath } = versionedPath()

			this.#url = [baseUrl.origin, versionPath, url].join('/')
		}
		else {
			this.#url = url
		}
	}

	async load() {
		this._emitter.emit(Events.LOADING)

		try {
			logger().log('FetchStore', this.#url)

			const data = await fetch(this.#url)

			logger().log('FetchStore', data)

			const json = await data.json()

			json.forEach(item => {
				const key = item[this.#key]

				this.#data[key] = item
			})
		}
		catch(err) {
			logger().error('FetchStore', err)
		}

		logger().log('FetchStore', this.#data)
		this._emitter.emit(Events.LOADED, this.#data)
	}

	get all() {
		return Object.values(this.#data)
	}

	byKey(key) {
		return key in this.#data ? this.#data[key] : null
	}
}
