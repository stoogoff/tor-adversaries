
import { isIn, isNull, notNull } from 'q/utils/assert.js'
import { infoStore, adversaryStore, customStore } from 'tor/stores.js'
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
		const data = { ...this.data, _id: undefined }

		// if this is a custom adversary load it from the data set
		// in case it has been edited
		if(isIn('isCustom', data) && data.isCustom) {
			const fromCustom = customStore.all.find(item => item._customId === data._customId)

			if(notNull(fromCustom)) {
				infoStore.item = fromCustom

				return
			}
		}

		infoStore.item = data
	},

	removeAdversary() {
		adversaryStore.remove(this.data)
	},

	highlight(evt, context) {
		this.data.customColour = evt.target.getAttribute('data-highlight')
	},
}
