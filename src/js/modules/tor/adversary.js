
import { isNull } from 'q/utils/assert.js'
import { infoStore, adversaryStore } from 'tor/stores.js'

export default {
	created() {
		if(isNull(this.data.attributes)) return

		this.on('change', () => {
			adversaryStore.add({ ...this.data })
		})
	},

	computed: {
		hasHate() {
			return 'hate' in (this.data?.attributes ?? {})
		},
		hasResolve() {
			return 'resolve' in (this.data?.attributes ?? {})
		},

		joinedTraits() {
			return (this.data?.traits ?? []).join(', ')
		},
	},

	showInfo() {
		infoStore.item = this.data
	},

	removeAdversary() {
		adversaryStore.remove(this.data)
	},
}
