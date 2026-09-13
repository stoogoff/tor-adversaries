
import { ObjectStore } from 'utils/object-store.js'
import { ListStore } from 'utils/list-store.js'

export const infoStore = new ObjectStore()

export const adversaryStore = new ListStore()

export const filterStore = new ObjectStore()
