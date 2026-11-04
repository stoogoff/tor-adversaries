
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

		// TODO if this is a custom adversary which has been edited it will show stale data
		// TODO this either needs to make it load by _customId
		// TODO or saving a custom adversary needs to clear out any in the adversary list
		// TODO ideally the former incase the user is has update Endurance or whatever
		// TODO basically it shouldn't reset anything which is in progress for the user

		infoStore.item = data
	},

	removeAdversary() {
		adversaryStore.remove(this.data)
	},
}
