
import { isIn, isNull, notEmptyArray } from 'q/utils/assert.js'
import {
	adversaryStore,
	customStore,
	editingStore,
	favouriteStore,
	filterStore,
	infoStore,
} from 'tor/stores.js'
import { AttackPropertiesMap, Events, HATE, RESOLVE } from 'utils/config.js'
import { convertAbilityText } from 'utils/lib.js'

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
			if(isNull(infoStore.item)) return false

			return favouriteStore.hasFavourite(infoStore.item.title)
		},

		isCustom() {
			if(isNull(infoStore.item)) return false

			return infoStore.item.isCustom ?? false
		},

		hasHate() {
			if(isNull(infoStore.item) || isNull(infoStore.item?.attributes)) return false

			return 'hate' in infoStore.item.attributes
		},
		hasResolve() {
			if(isNull(infoStore.item) || isNull(infoStore.item?.attributes)) return false

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
			return infoStore?.item?.attributes?.level ?? 1
		},
		endurance() {
			return infoStore?.item?.attributes?.endurance ?? 1
		},
		might() {
			return infoStore?.item?.attributes?.might ?? 1
		},
		hate() {
			return infoStore?.item?.attributes?.hate ?? 0
		},
		resolve() {
			return infoStore?.item?.attributes?.resolve ?? 0
		},
		parry() {
			const parry = infoStore?.item?.attributes?.parry ?? 0

			if(parry === 0) {
				return "—"
			}

			return parry < 0 ? `-${parry}` : `+${parry}`
		},
		armour() {
			return infoStore?.item?.attributes?.armour ?? 0
		},
		attacks() {
			return (infoStore?.item?.attacks ?? []).map(attack => ({
				...attack,
				hasProperties: notEmptyArray(attack.properties),
				properties: attack.properties.map(property => ({
					property,
					tooltip: property in AttackPropertiesMap ? AttackPropertiesMap[property] : null,
					on: () => {},
				}))
			}))
		},
		abilities() {
			const group = infoStore?.item?.group ?? ''
			const hateOrResolve = isIn('hate', infoStore?.item?.attributes ?? {}) ? HATE : RESOLVE

			return (infoStore?.item?.abilities ?? []).map(ability => ({
				name: ability.name,
				ability: convertAbilityText({
					text: ability.ability,
					rank: ability.rank,
					hateOrResolve,
					group,
				}),
			}))
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
			_id: undefined,
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

	editAdversary() {
		editingStore.item = infoStore.item
	},

	deleteAdversary() {
		customStore.remove(infoStore.item)
		infoStore.item = null
	},
}
