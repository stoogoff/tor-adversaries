
import { notEmptyString, isNull, isNumber, notNull, notNumber } from 'q/utils/assert.js'
import { Events } from 'utils/config.js'
import { chosenAbilityStore, chosenAttackStore } from './stores.js'

export default {
	data: {
		title: null,
		description: null,
		traits: null,
		attribute: null,
		endurance: null,
		might: null,
		hateOrResolve: 'Hate',
		parry: null,
		armour: null,
	},

	created() {
		chosenAbilityStore.on(Events.CHANGE_ALL, () => this.emit(Events.CHANGE))
		chosenAttackStore.on(Events.CHANGE_ALL, () => this.emit(Events.CHANGE))
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
			group: 'Mine',
		}

		console.log(newAdversary)

		// TODO save this to a store somewhere
	},
}
