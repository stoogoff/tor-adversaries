
// local storage keys
export const STORAGE_KEY_OBJECT = 'tor:adversary'
export const STORAGE_KEY_LIST = 'tor:adversaries'
export const STORAGE_KEY_FAVOURITES = 'tor:favourites'

export const CHIP_FAVOURITE = 'Favourite'

export const Events = {
	CHANGE: 'change',
	CHANGE_ALL: 'change:all',
	ADD: 'add',
	REMOVE: 'remove',
	LOADING: 'loading',
	LOADED: 'loaded',
}

export const AttackPropertiesMap = {
	'Pierce': '+2 Feat die result',
	'Break Shield': 'Break target’s shield unless it has rewards',
	'Seize': 'Target can only make Brawling attacks in Forward stance',
	'Knockback': '',
}
