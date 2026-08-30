
import { notEmptyArray } from 'q/utils/assert.js'
import { adversaryStore } from 'tor/stores.js'
import { logger } from 'tor/logger.js'

export default {
	mounted() {
		adversaryStore.on('change:all', (_, adversaries) => {
			logger().info('manager: adversaryStore.on("change:all")', [ ...adversaries ])
			this.emit('change')
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
