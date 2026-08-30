
import { isNull } from 'q/utils/assert.js'
import { infoStore, adversaryStore } from 'tor/stores.js'

export default {
	/*data: {
		currentEndurance: 0,
		currentMight: 0,
		currentHate: 0,
		currentResolve: 0,
	},*/

	created() {
		/*if(isNull(this.data.attributes)) return

		this.data.currentEndurance = this.data.attributes.endurance
		this.data.currentMight = this.data.attributes.might
		this.data.currentHate = this.data.attributes.hate
		this.data.currentResolve = this.data.attributes.resolve*/
	},

	computed: {
		hasHate() {
			return 'hate' in (this.data?.attributes ?? {})
		},
		hasResolve() {
			return 'resolve' in (this.data?.attributes ?? {})
		},
	},

	showInfo() {
		infoStore.item = this.data
	},

	removeAdversary() {
		adversaryStore.remove(this.data)
	},
}
