
import { customStore, favouriteStore, filterStore } from 'tor/stores.js'
import { Events, FILTER_FAVOURITE, FILTER_CUSTOM } from 'utils/config.js'
import { openMenu, toggleMenu, openCreateModal } from 'utils/lib.js'

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
}
