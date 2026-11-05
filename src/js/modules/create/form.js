
import { notEmptyArray, isIn } from 'q/utils/assert.js'
import { Events, HATE, RESOLVE, AttackPropertiesMap } from 'utils/config.js'
import { closeCreateModal, openCreateModal, convertAbilityText } from 'utils/lib.js'
import {
	customStore,
	chosenAbilityStore,
	chosenAttackStore,
	editingStore,
	formData,
} from 'create/stores.js'

export default {
	data: {
		hateOrResolve: 'Hate',
	},

	created() {
		chosenAbilityStore.on(Events.CHANGE_ALL, () => this.emit(Events.CHANGE))
		chosenAttackStore.on(Events.CHANGE_ALL, () => this.emit(Events.CHANGE))
		editingStore.on(Events.CHANGE, () => {
			const editing = editingStore.item

			formData.setFromAdversary({ ...editing })

			this.data.hateOrResolve = isIn('hate', editing.attributes) ? HATE : RESOLVE

			chosenAbilityStore.set(editing.abilities)
			chosenAttackStore.set(editing.attacks)

			openCreateModal()
		})

		formData.on(Events.CHANGE, () => this.emit(Events.CHANGE))
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
			return formData.isValid()
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
		formData.reset()
		chosenAbilityStore.clear()
		chosenAttackStore.clear()
	},

	submit() {
		const newAdversary = formData.toAdversary(this.data.hateOrResolve)

		customStore.add(newAdversary)

		this.reset()

		closeCreateModal()
	},
}
