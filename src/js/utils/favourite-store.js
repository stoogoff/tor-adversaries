
import { ListStore } from 'utils/list-store.js'

export class FavouriteStore extends ListStore {
	addFavourite(title) {
		this.add({ title })
	}

	hasFavourite(title) {
		return this.all.find(favourite => favourite.title === title)
	}

	hasFavourites() {
		return this.all.length > 0
	}

	removeFavourite(title) {
		const currentFavourite = this.all
			.find(favourite => favourite.title === title)

		if(currentFavourite) {
			this.remove(currentFavourite)
		}
	}
}
