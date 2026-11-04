
import { notEmptyString, isIn, isNull, isNumber, notNull, notNumber } from 'q/utils/assert.js'
import { createId } from 'q/utils/string.js'
import { Events, ID_LENGTH } from 'utils/config.js'
import { closeCreateModal, openCreateModal } from 'utils/lib.js'
import { customStore, chosenAbilityStore, chosenAttackStore, editingStore } from './stores.js'

export default {
	data: {
		_id: null,
		title: null,
		description: null,
		traits: null,
		attribute: null,
		endurance: null,
		might: null,
		hateOrResolve: 'Hate',
		parry: null,
		armour: null,
		group: null,
	},

	created() {
		chosenAbilityStore.on(Events.CHANGE_ALL, () => this.emit(Events.CHANGE))
		chosenAttackStore.on(Events.CHANGE_ALL, () => this.emit(Events.CHANGE))
		editingStore.on(Events.CHANGE, () => {
			const editing = editingStore.item

			this.data._id = editing._customId
			this.data.title = editing.title
			this.data.description = editing.description
			this.data.traits = editing.traits.join(', ')
			this.data.attribute = editing.attributes.level
			this.data.endurance = editing.attributes.endurance
			this.data.might = editing.attributes.might
			this.data.hateOrResolve = isIn('hate', editing.attributes) ? 'Hate' : 'Resolve'
			this.data.parry = editing.attributes.parry
			this.data.armour = editing.attributes.armour
			this.data.group = editing.group

			chosenAbilityStore.set(editing.abilities)
			chosenAttackStore.set(editing.attacks)

			openCreateModal()
		})
	},

	computed: {
 		chosenAbilities() {
			return [ ...chosenAbilityStore.all ]
		},

		chosenAttacks() {
			return [ ...chosenAttackStore.all ]
		},

		hasChosenAttacks() {
			return chosenAttackStore.all.length > 0
		},

		hasTouchedForm() {
			console.log({
				title: notNull(this.data.title),
				attribute: notNull(this.data.attribute),
				endurance: notNull(this.data.endurance),
				might: notNull(this.data.might),
			})

			return notNull(this.data.title) ||
				notNull(this.data.attribute) ||
				notNull(this.data.endurance) ||
				notNull(this.data.might)
		},

		isValid() {
			return this.data.isValidTitle &&
				this.data.isValidAttribute &&
				this.data.isValidEndurance &&
				this.data.isValidMight
		},
		isValidTitle() {
			return notEmptyString(this.data.title)
		},
		isValidAttribute() {
			return notEmptyString(this.data.attribute)
		},
		isValidEndurance() {
			return notEmptyString(this.data.endurance)
		},
		isValidMight() {
			return notEmptyString(this.data.might)
		},
	},

	removeAbility(_evt, context) {
		chosenAbilityStore.remove({ ...context.scope.data })
	},

	removeAttack(_evt, context) {
		chosenAttackStore.remove({ ...context.scope.data })
	},

	cancel() {
		closeCreateModal()
	},

	submit(evt) {
		const attributeLevel = parseInt(this.data.attribute)
		const newAdversary = {
			title: this.data.title,
			description: this.data.description,
			traits: (this.data.traits ?? '').split(/\s*,\s*/).filter(trait => !!trait),
			attributes: {
				level: attributeLevel,
				endurance: parseInt(this.data.endurance),
				might: parseInt(this.data.might),
				[this.data.hateOrResolve.toLowerCase()]: attributeLevel,
				parry: parseInt(this.data.parry ?? '0'),
				armour: parseInt(this.data.armour ?? '0'),
			},
			attacks: [ ...chosenAttackStore.all ],
			abilities: [ ...chosenAbilityStore.all ],
			group: this.data.group,
			sources: ['Mine'],
			isCustom: true,
		}

		newAdversary._id = newAdversary._customId = notNull(this.data._id)
			? this.data._id
			: createId(ID_LENGTH)

		customStore.add(newAdversary)

		this.data._id = null
		this.data.title = null
		this.data.description = null
		this.data.traits = null
		this.data.attribute = null
		this.data.endurance = null
		this.data.might = null
		this.data.hateOrResolve = 'Hate'
		this.data.parry = null
		this.data.armour = null
		this.data.group = null

		chosenAbilityStore.clear()
		chosenAttackStore.clear()

		closeCreateModal()
	},
}
