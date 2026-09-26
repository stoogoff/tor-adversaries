
import { notNull } from 'q/utils/assert.js'
import { Emittable } from 'q/utils/emittable.js'
import { logger } from 'tor/logger.js'
import { Events } from 'utils/config.js'

export class ObjectStore extends Emittable {
	#data

	get item() {
		return this.#data
	}

	set item(data) {
		this.#data = data
		this._emitter.emit(Events.CHANGE, this.#data)
	}

	get has() {
		return notNull(this.#data)
	}
}
