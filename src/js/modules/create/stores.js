
import { FetchStore } from 'utils/fetch-store.js'

// all abilities loaded from JSON
export const abilityStore = new FetchStore('data/abilities.json', 'name')
