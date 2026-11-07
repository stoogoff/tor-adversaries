
import { notEmptyString, notNull } from 'q/utils/assert.js'
import { Emittable } from 'q/utils/emittable.js'
import { createId } from 'q/utils/string.js'
import { Events, ID_LENGTH, FILTER_CUSTOM } from 'utils/config.js'
import { chosenAbilityStore, chosenAttackStore } from 'create/stores.js'

export class FormModel extends Emittable {
	#model = {}

	reset() {
		this.setProperty('_id', null)
		this.setProperty('_customId', null)
		this.setProperty('title', null)
		this.setProperty('description', null)
		this.setProperty('traits', null)
		this.setProperty('attribute', null)
		this.setProperty('endurance', null)
		this.setProperty('might', null)
		this.setProperty('parry', null)
		this.setProperty('armour', null)
		this.setProperty('group', null)

		this._emitter.emit(Events.CHANGE, this.#model)
	}

	isValid() {
		return notEmptyString(this.#model.title)
			&& notEmptyString(this.#model.attribute)
			&& notEmptyString(this.#model.endurance)
			&& notEmptyString(this.#model.might)
	}

	getProperty(property) {
		return this.#model[property] ?? null
	}

	setProperty(property, value) {
		this.#model[property] = value
		this._emitter.emit(`${Events.CHANGE}:${property}`, property, value)
	}

	setFromAdversary(adversary) {
		this.setProperty('_id', adversary._customId)
		this.setProperty('_customId', adversary._customId)
		this.setProperty('title', adversary.title)
		this.setProperty('description', adversary.description)
		this.setProperty('traits', adversary.traits.join(', '))
		this.setProperty('attribute', adversary.attributes.level)
		this.setProperty('endurance', adversary.attributes.endurance)
		this.setProperty('might', adversary.attributes.might)
		this.setProperty('parry', adversary.attributes.parry)
		this.setProperty('armour', adversary.attributes.armour)
		this.setProperty('group', adversary.group)

		this._emitter.emit(Events.CHANGE, this.#model)
	}

	toAdversary(hateOrResolve) {
		const attributeLevel = parseInt(this.#model.attribute)
		const newAdversary = {
			title: this.#model.title,
			description: this.#model.description,
			traits: (this.#model.traits ?? '').split(/\s*,\s*/).filter(trait => !!trait),
			attributes: {
				level: attributeLevel,
				endurance: parseInt(this.#model.endurance),
				might: parseInt(this.#model.might),
				[hateOrResolve.toLowerCase()]: attributeLevel,
				parry: parseInt(this.#model.parry ?? '0'),
				armour: parseInt(this.#model.armour ?? '0'),
			},
			attacks: [ ...chosenAttackStore.all ],
			abilities: [ ...chosenAbilityStore.all ],
			group: this.#model.group,
			sources: [FILTER_CUSTOM],
			isCustom: true,
		}

		newAdversary._id = newAdversary._customId = notNull(this.#model._id)
			? this.#model._id
			: createId(ID_LENGTH)

		return newAdversary
	}
}
