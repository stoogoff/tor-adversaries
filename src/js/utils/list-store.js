
import { throwIfNull } from 'q/utils/assert.js'
import { createId } from 'q/utils/string.js'
import { Emittable } from 'utils/emittable.js'

const mapItem = item => ({ ...item, _id: item._id ?? createId(12) })

export class ListStore extends Emittable {
	#data = {}

	constructor(data = []) {
		super()

		data.map(mapItem).forEach(item => {
			this.#data[item._id] = item
		})
	}

	get all() {
		return Object.values(this.#data)
	}

	add(item) {
		const model = mapItem(item)

		this.#data[model._id] = model

		this._emitter.emit('add', model)
		this._emitter.emit('change:all', 'all', this.all)

		return model
	}

	remove(item) {
		throwIfNull(item._id)

		delete this.#data[item._id]

		this._emitter.emit('remove', item)
		this._emitter.emit('change:all', 'all', this.all)

		return item
	}
}
