
import { isNull } from 'q/utils/assert.js'
import { infoStore, adversaryStore } from 'tor/stores.js'
import { Events } from 'utils/config.js'

export default {
	created() {
		if(isNull(this.data.attributes)) return

		this.on(Events.CHANGE, () => {
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
		const data = { ...this.data }

		delete data._id

		infoStore.item = data
	},

	removeAdversary() {
		adversaryStore.remove(this.data)
	},
}
