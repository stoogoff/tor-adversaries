
import { FetchStore } from 'utils/fetch-store.js'
import { infoStore } from 'tor/stores.js'

export default {
	store: new FetchStore('./data/adversaries.json'),

	data: {
		loading: false,
	},

	async created() {
		this.store.on('loading', () => this.data.loading = true)
		this.store.on('loaded', () => {
			// DELME
			//window.setTimeout(() => {
				this.data.loading = false
				this.emit('change')
			//}, 1000)
		})

		await this.store.load()
	},

	computed: {
		adversaries() {
			return this.store ? this.store.all : []
		},
	},

	click(evt, context) {
		const adversary = context.scope.data

		infoStore.item = adversary
	}
}
