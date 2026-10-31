
import { isNull } from 'q/utils/assert.js'
import {
	infoStore,
	adversaryStore,
	filterStore,
	favouriteStore,
} from 'tor/stores.js'
import { AttackPropertiesMap, Events } from 'utils/config.js'

export default {
	created() {
		infoStore.on(Events.CHANGE, () => this.emit(Events.CHANGE))
		favouriteStore.on(Events.CHANGE_ALL, () => this.emit(Events.CHANGE))
	},

	computed: {
		hasAdversary() {
			return infoStore && infoStore.has
		},

		isFavourite() {
			if(isNull(infoStore?.item)) return false

			return favouriteStore.hasFavourite(infoStore.item.title)
		},

		hasHate() {
			if(isNull(infoStore?.item)) return false

			return 'hate' in infoStore.item.attributes
		},
		hasResolve() {
			if(isNull(infoStore?.item)) return false

			return 'resolve' in infoStore.item.attributes
		},

		title() {
			return infoStore?.item?.title ?? ''
		},
		description() {
			return infoStore?.item?.description ?? ''
		},
		sources() {
			return (infoStore?.item?.sources ?? []).map(source => ({ source }))
		},
		group() {
			return infoStore?.item?.group ?? ''
		},
		adventures() {
			return (infoStore?.item?.adventures ?? []).map(adventure => ({ adventure }))
		},
		traits() {
			return (infoStore?.item?.traits ?? []).join(', ')
		},
		level() {
			return infoStore?.item?.attributes.level ?? 1
		},
		endurance() {
			return infoStore?.item?.attributes.endurance ?? 1
		},
		might() {
			return infoStore?.item?.attributes.might ?? 1
		},
		hate() {
			return infoStore?.item?.attributes.hate ?? 0
		},
		resolve() {
			return infoStore?.item?.attributes.resolve ?? 0
		},
		parry() {
			const parry = infoStore?.item?.attributes.parry ?? 0

			if(parry === 0) {
				return "—"
			}

			return parry < 0 ? `-${parry}` : `+${parry}`
		},
		armour() {
			return infoStore?.item?.attributes.armour ?? 0
		},
		attacks() {
			const attacks = infoStore?.item?.attacks ?? []

			const r = attacks.map(attack => ({
				...attack,
				hasProperties: attack.properties.length > 0,
				properties: attack.properties.map(property => ({
					property,
					tooltip: property in AttackPropertiesMap ? AttackPropertiesMap[property] : null,
					on: () => {},
				}))
			}))

			console.log(r)
			return r
		},
		abilities() {
			return infoStore?.item?.abilities ?? []
		},
		hasAbilities() {
			return (infoStore?.item?.abilities ?? []).length > 0
		},
	},

	openChip(event) {
		filterStore.item = event.target.innerText
	},

	addAdversary() {
		const adversary = infoStore.item

		adversaryStore.add({
			...adversary,
			currentEndurance: adversary.attributes.endurance,
			currentMight: adversary.attributes.might,
			currentHate: adversary.attributes.hate,
			currentResolve: adversary.attributes.resolve,
		})
	},

	addFavourite() {
		favouriteStore.addFavourite(infoStore.item.title)
	},

	removeFavourite() {
		favouriteStore.removeFavourite(infoStore.item.title)
	},
}
