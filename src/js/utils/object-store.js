
import { notNull } from 'q/utils/assert.js'
import { Emitter } from 'q/utils/emitter.js'
import { logger } from 'tor/logger.js'

export class ObjectStore {
	#emitter
	#data

	constructor() {
		this.#emitter = new Emitter()
	}

	get item() {
		return this.#data
	}

	set item(data) {
		this.#data = data
		this.#emitter.emit('change', this.#data)
	}

	get has() {
		return notNull(this.#data)
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
