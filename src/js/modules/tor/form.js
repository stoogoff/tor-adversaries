
import { notEmptyString, isNull, isNumber, notNumber } from 'q/utils/assert.js'

export default {
	data: {
		name: null,
		description: null,
		attribute: null,
		endurance: null,
		might: null,
		hateOrResolve: 'Hate',
		parry: null,
		armour: null,
	},

	computed: {
		isValid() {
			return this.data.isValidName &&
				this.data.isValidAttribute &&
				this.data.isValidEndurance &&
				this.data.isValidMight
		},
		isValidName() {
			return notEmptyString(this.data.name)
		},
		isValidAttribute() {
			return notEmptyString(this.data.attribute)
		},
		isValidEndurance() {
			return notEmptyString(this.data.endurance)
		},
		isValidMight() {
			return notEmptyString(this.data.might)
		},
	},

	submit(evt) {
		evt.preventDefault()

		console.log({
			...this.data
		})
	},
}
