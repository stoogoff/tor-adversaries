
import { download } from 'q/utils/file.js'
import { customStore, favouriteStore, filterStore } from 'tor/stores.js'
import { Events, FILTER_FAVOURITE, FILTER_CUSTOM } from 'utils/config.js'
import {
	openCreateModal,
	openCustomUploadModal,
	openMenu,
	showToast,
	toggleMenu,
} from 'utils/lib.js'
import { logger } from 'utils/logger.js'

export default {
	mounted() {
		favouriteStore.on(Events.CHANGE_ALL, () => this.emit(Events.CHANGE))
		customStore.on(Events.CHANGE_ALL, () => this.emit(Events.CHANGE))
	},

	computed: {
		hasFavourites() {
			return favouriteStore.hasFavourites()
		},

		hasCustom() {
			return customStore.all.length > 0
		},
	},

	toggleMenu() {
		toggleMenu()
	},

	openFavourites() {
		filterStore.item = FILTER_FAVOURITE
		openMenu()
	},

	openCustom() {
		filterStore.item = FILTER_CUSTOM
		openMenu()
	},

	openCreateModal() {
		openCreateModal()
	},

	downloadCustom() {
		try {
			const adversaries = JSON.stringify(customStore.all, null, '\t')

			download('tor-custom-adversaries.json', new Blob([adversaries], { type: 'application/json' }))
		}
		catch(error) {
			logger().error(error)
			showToast('There was an error downloading the file.')
		}
	},

	openCustomUploadModal() {
		openCustomUploadModal()
	},
}
