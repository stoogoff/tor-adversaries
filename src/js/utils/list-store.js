
import { throwIfNull } from 'q/utils/assert.js'
import { createId } from 'q/utils/string.js'
import { Emittable } from 'utils/emittable.js'

const mapItem = item => ({ ...item, _id: item._id ?? createId(12) })

export class ListStore extends Emittable {
	#data = []

	constructor(data = []) {
		super()

		this.#data = data.map(mapItem)
	}

	get all() {
		return this.#data
	}

	add(item) {
		const model = mapItem(item)

		this.#data.push(model)

		this._emitter.emit('add', model)
		this._emitter.emit('change:all', 'all', this.#data)

		return model
	}

	addRange(items) {
		const models = items.map(mapItem)

		models.forEach(model => {
			this.#data.push(model)
			this._emitter.emit('add', model)
		})

		this._emitter.emit('change:all', 'all', this.#data)

		return models
	}

	remove(item) {
		throwIfNull(item._id)

		this.#data = this.#data.filter(toRemove => toRemove._id !== item._id)

		this._emitter.emit('remove', item)
		this._emitter.emit('change:all', 'all', this.#data)

		return item
	}

	empty() {
		if(this.#data.length === 0) return

		this.#data.forEach(item => {
			this._emitter.emit('remove', item)
		})

		this.#data = []
		this._emitter.emit('change:all', 'all', this.#data)
	}
}
