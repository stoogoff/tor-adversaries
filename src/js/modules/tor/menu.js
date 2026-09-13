
import { isEmptyString } from 'q/utils/assert.js'
import { sortByProperty } from 'q/utils/list.js'
import { FetchStore } from 'utils/fetch-store.js'
import { infoStore, filterStore } from 'tor/stores.js'

export default {
	store: new FetchStore('./data/adversaries.json'),

	data: {
		loading: false,
		filter: '',
	},

	async created() {
		this.store.on('loading', () => this.data.loading = true)
		this.store.on('loaded', () => {
			this.data.loading = false
			this.emit('change')
		})

		filterStore.on('change', () => {
			this.data.filter = filterStore.item
		})

		await this.store.load()
	},

	computed: {
		count() {
			return (this.data.adversaries ?? []).length
		},

		total() {
			return (this.store?.all ?? []).length
		},

		adversaries() {
			const data = (this.store?.all ?? []).sort(sortByProperty('title'))

			if(isEmptyString(this.data.filter)) {
				return data
			}

			const filter = this.data.filter.toLowerCase().trim()

			return data.filter(item => 
				item.group.toLowerCase() === filter ||
				item.sources.filter(source => source.toLowerCase() === filter).length > 0 ||
				item.title.toLowerCase().indexOf(filter) !== -1
			)
		},
	},

	handleFilter(evt) {
		this.data.filter = evt.srcElement.value
	},

	handleClick(evt, context) {
		infoStore.item = context.scope.data
	},
}
