
import {
	notEmptyString,
	notEmptyArray,
	isIn,
	isNull,
	isNumber,
	notNull,
	notNumber,
} from 'q/utils/assert.js'
import { createId } from 'q/utils/string.js'
import { Events, ID_LENGTH, HATE, RESOLVE, AttackPropertiesMap } from 'utils/config.js'
import { closeCreateModal, openCreateModal, convertAbilityText } from 'utils/lib.js'
import {
	customStore,
	chosenAbilityStore,
	chosenAttackStore,
	editingStore,
} from './stores.js'

export default {
	data: {
		_id: null,
		title: null,
		description: null,
		traits: null,
		attribute: null,
		endurance: null,
		might: null,
		hateOrResolve: HATE,
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
			this.data.hateOrResolve = isIn('hate', editing.attributes) ? HATE : RESOLVE
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
			return (chosenAbilityStore.all ?? []).map(ability => ({
				...ability,
				ability: convertAbilityText({
					text: ability.ability,
					rank: ability.rank,
					hateOrResolve: this.data.hateOrResolve === HATE ? HATE : RESOLVE,
					group: this.data.group,
				})
			}))
		},

		chosenAttacks() {
			return (chosenAttackStore.all ?? []).map(attack => ({
				...attack,
				hasProperties: notEmptyArray(attack.properties),
				properties: attack.properties.map(property => ({
					property,
					tooltip: property in AttackPropertiesMap ? AttackPropertiesMap[property] : null,
					on: () => {},
				})),
			}))
		},

		hasChosenAttacks() {
			return chosenAttackStore.all.length > 0
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
		this.reset()

		closeCreateModal()
	},

	reset() {
		this.data._id = null
		this.data.title = null
		this.data.description = null
		this.data.traits = null
		this.data.attribute = null
		this.data.endurance = null
		this.data.might = null
		this.data.hateOrResolve = HATE
		this.data.parry = null
		this.data.armour = null
		this.data.group = null

		chosenAbilityStore.clear()
		chosenAttackStore.clear()
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

		this.reset()

		closeCreateModal()
	},
}
