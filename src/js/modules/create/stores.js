
import { throwIfNull } from 'q/utils/assert.js'
import { Emittable } from 'q/utils/emittable.js'
import { FetchStore } from 'utils/fetch-store.js'
import { Events } from 'utils/config.js'

// all abilities loaded from JSON
export const abilityStore = new FetchStore('data/abilities.json', 'name')

// TODO this needs to be set up to handle changes to a created adversary
// but it should be more like the FavouriteStore and only expose
// specific, relevant information, rather than relying on a grab
// bag of properties
class EditingAdversaryStore extends Emittable {
	#abilities = []

	get abilities() {
		return this.#abilities
	}

	addAbility(ability) {
		throwIfNull(ability, 'ability')
		throwIfNull(ability.name, 'name')
		throwIfNull(ability.ability, 'ability')

		this.#abilities.push(ability)

		this._emitter.emit(Events.CHANGE, this.#abilities)
	}
}

export const editingStore = new EditingAdversaryStore()
