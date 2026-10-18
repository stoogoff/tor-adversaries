
import { toggleMenu } from 'utils/menu.js'
import { favouriteStore, filterStore } from 'tor/stores.js'
import { Events, CHIP_FAVOURITE } from 'utils/config.js'

export default {
	mounted() {
		favouriteStore.on(Events.CHANGE_ALL, () => this.emit(Events.CHANGE))
	},

	computed: {
		hasFavourites() {
			return favouriteStore.hasFavourites()
		},
	},

	toggleMenu() {
		toggleMenu()
	},

	openFavourites() {
		filterStore.item = CHIP_FAVOURITE
		this.toggleMenu()
	},
}
