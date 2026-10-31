
import { FetchStore } from 'utils/fetch-store.js'
import { ListStore } from 'utils/list-store.js'

// all abilities loaded from JSON
export const abilityStore = new FetchStore('data/abilities.json', 'name')

// abilities which have been chosen in the form
export const chosenAbilityStore = new ListStore()

// attacks which have been chosen in the form
export const chosenAttackStore = new ListStore()


