
import { isEmptyString } from 'q/utils/assert.js'
import { sortByProperty } from 'q/utils/list.js'
import { normalise } from 'q/utils/string.js'
import { infoStore, filterStore, adversaryStore, dataStore } from 'tor/stores.js'
import { closeMenu } from 'utils/menu.js'
import { Events } from 'utils/config.js'

export default {
	data: {
		loading: false,
		filter: '',
	},

	async created() {
		dataStore.on(Events.LOADING, () => this.data.loading = true)
		dataStore.on(Events.LOADED, () => {
			this.data.loading = false
			this.emit(Events.CHANGE)
		})

		filterStore.on(Events.CHANGE, () => {
			this.data.filter = filterStore.item
		})

		await dataStore.load()
	},

	computed: {
		count() {
			return (this.data.adversaries ?? []).length
		},

		total() {
			return (dataStore?.all ?? []).length
		},

		adversaries() {
			const data = (dataStore?.all ?? []).sort(sortByProperty('title'))

			if(isEmptyString(this.data.filter)) {
				return data
			}

			const filter = normalise(this.data.filter).trim()

			return data.filter(item => 
				normalise(item.group) === filter ||
				item.sources.filter(source => normalise(source) === filter).length > 0 ||
				(item.adventures ?? []).filter(source => normalise(source) === filter).length > 0 ||
				normalise(item.title).indexOf(filter) !== -1
			)
		},
	},

	handleFilter(evt) {
		this.data.filter = evt.srcElement.value
	},

	handleClick(evt, context) {
		infoStore.item = context.scope.data

		closeMenu()
	},
}
