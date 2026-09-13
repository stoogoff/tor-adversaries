
import { notNull } from 'q/utils/assert.js'
import { Emittable } from 'q/utils/emittable.js'
import { logger } from 'tor/logger.js'

export class ObjectStore extends Emittable {
	#data

	get item() {
		return this.#data
	}

	set item(data) {
		this.#data = data
		this._emitter.emit('change', this.#data)
	}

	get has() {
		return notNull(this.#data)
	}
}
