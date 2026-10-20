
import { isEmptyString } from 'q/utils/assert.js'
import { sortByProperty } from 'q/utils/list.js'
import { normalise } from 'q/utils/string.js'
import { abilityStore } from 'create/stores.js'
import { Events } from 'utils/config.js'

export default {
	data: {
		loading: false,
		filter: '',
	},

	async created() {
		abilityStore.on(Events.LOADING, () => this.data.loading = true)
		abilityStore.on(Events.LOADED, () => {
			this.data.loading = false
			this.emit(Events.CHANGE)
			console.log({ abilities: abilityStore.all })
		})

		await abilityStore.load()
	},

	computed: {
		abilities() {
			const data = (abilityStore?.all ?? []).sort(sortByProperty('name'))

			if(isEmptyString(this.data.filter)) {
				return []
			}

			const filter = normalise(this.data.filter).trim()

			return data.filter(item => normalise(item.name).indexOf(filter) !== -1)
		},
	},

	handleFilter(evt) {
		this.data.filter = evt.srcElement.value
	},
}
