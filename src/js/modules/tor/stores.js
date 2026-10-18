
import { local } from 'q/utils/storage.js'
import { STORAGE_KEY_LIST, STORAGE_KEY_OBJECT, STORAGE_KEY_FAVOURITES } from 'utils/config.js'
import { FetchStore } from 'utils/fetch-store.js'
import { ListStore } from 'utils/list-store.js'
import { ObjectStore } from 'utils/object-store.js'
import { logger } from 'tor/logger.js'
import { Events } from 'utils/config.js'

// the adversary displayed in the info panel at the top
export const infoStore = new ObjectStore()

// the list of adversaries displayed with stats
export const adversaryStore = new ListStore()

// handles sending text to the input filter, currently from clicking on a chip
// this is probably overkill...
export const filterStore = new ObjectStore()

// all adversary data loaded from JSON
export const dataStore = new FetchStore('data/adversaries.json')

// all adversaries stored as favourites
export const favouriteStore = new ListStore()

favouriteStore.addFavourite = title => {
	favouriteStore.add({ title })
}

favouriteStore.hasFavourite  = title => favouriteStore.all.find(favourite => favourite.title === title)
favouriteStore.hasFavourites = () => favouriteStore.all.length > 0

favouriteStore.removeFavourite = title => {
	const currentFavourite = favouriteStore.all
		.find(favourite => favourite.title === title)

	if(currentFavourite) {
		favouriteStore.remove(currentFavourite)
	}
}

// changes to the primary stores are save to local storage
// and loaded when the page is refreshed
infoStore.on(Events.CHANGE, () => {
	logger().log('infoStore::change', infoStore.item)

	local.set(STORAGE_KEY_OBJECT, { ...infoStore.item })
})

adversaryStore.on(Events.CHANGE_ALL, () => {
	logger().log('adversaryStore::change:all', adversaryStore.all)

	local.set(STORAGE_KEY_LIST, [ ...adversaryStore.all ])
})

dataStore.on(Events.LOADING, () => {
	logger().log('dataStore::loading', local.has(STORAGE_KEY_OBJECT), local.has(STORAGE_KEY_LIST))

	if(local.has(STORAGE_KEY_OBJECT)) {
		const infoPanel = local.get(STORAGE_KEY_OBJECT)

		logger().log(STORAGE_KEY_OBJECT, infoPanel)
		infoStore.item = infoPanel
	}

	if(local.has(STORAGE_KEY_LIST)) {
		const storedAdversaries = local.get(STORAGE_KEY_LIST)

		logger().log(STORAGE_KEY_LIST, storedAdversaries)
		adversaryStore.set(storedAdversaries)
	}

	if(local.has(STORAGE_KEY_FAVOURITES)) {
		const favourites = local.get(STORAGE_KEY_FAVOURITES)

		logger().log(STORAGE_KEY_FAVOURITES, favourites)
		favouriteStore.set(favourites)
	}
})

favouriteStore.on(Events.CHANGE_ALL, () => {
	logger().log('favouriteStore::change:all', favouriteStore.all)

	local.set(STORAGE_KEY_FAVOURITES, [ ...favouriteStore.all ])
})
