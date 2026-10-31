
import { isEmptyString, throwIfNull } from 'q/utils/assert.js'
import { sortByProperty } from 'q/utils/list.js'
import { normalise } from 'q/utils/string.js'
import { abilityStore, chosenAbilityStore } from 'create/stores.js'
import { Events } from 'utils/config.js'

export default {
	data: {
		loading: false,
		filter: '',
	},

	async created() {
		chosenAbilityStore.on(Events.CHANGE_ALL, () => this.emit(Events.CHANGE))

		abilityStore.on(Events.LOADING, () => this.data.loading = true)
		abilityStore.on(Events.LOADED, () => {
			this.data.loading = false
			this.emit(Events.CHANGE)
		})

		await abilityStore.load()
	},

	computed: {
		abilities() {
			const data = (abilityStore?.all ?? []).sort(sortByProperty('name'))

			if(isEmptyString(this.data.filter)) {
				return []
			}

			const current = chosenAbilityStore.all.map(ability => ability.name)
			const filter = normalise(this.data.filter).trim()

			return data.filter(item => normalise(item.name).indexOf(filter) !== -1)
				.filter(item => !current.includes(item.name))
				.map(item => ({
					...item,
					rank: null,
					isNumber: item.ranked && item.type === 'number',
					isList: item.ranked && item.type === 'list',
					// NOTE the `on: () => void` function here is to prevent an error in q
					values: item.type === "list" ? item.values.map(value => ({ value, on: () => {} })) : null,
				}))
		},
	},

	handleAdd(_evt, context) {
		const ability = {
			name: context.scope.data.name,
			ability: context.scope.data.ability,
			rank: context.scope.data.rank,
			ranked: context.scope.data.ranked,
		}

		// TODO need to show a toast for these
		// TODO only the ranked stuff should be able to error
		throwIfNull(ability, 'ability')
		throwIfNull(ability.name, 'name')
		throwIfNull(ability.ability, 'ability')

		if(ability.ranked) {
			throwIfNull(ability.rank, 'rank')
		}

		chosenAbilityStore.add(ability)
	},

	handleFilter(evt) {
		this.data.filter = evt.srcElement.value
	},
}
