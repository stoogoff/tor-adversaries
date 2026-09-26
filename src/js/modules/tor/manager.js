
import { notEmptyArray } from 'q/utils/assert.js'
import { adversaryStore } from 'tor/stores.js'
import { logger } from 'tor/logger.js'
import { Events } from 'utils/config.js'

export default {
	mounted() {
		adversaryStore.on(Events.CHANGE_ALL, (_, adversaries) => {
			logger().info('manager: adversaryStore.on("change:all")', [ ...adversaries ])
			this.emit(Events.CHANGE)
		})
	},

	computed: {
		hasAdversaries() {
			return notEmptyArray(adversaryStore.all)
		},

		adversaries() {
			return [ ...adversaryStore.all ]
		},
	},
}
