
import { notEmptyString } from 'q/utils/assert.js'
import { formData } from 'create/stores.js'
import { Events } from 'utils/config.js'

export default {
	data: {
		hasTouchedForm: false,
		value: '',
	},

	mounted() {
		const formInput = this.node.querySelector('*[name]')

		formData.on(`${Events.CHANGE}:${formInput.name}`, () => {
			this.data.value = formData.getProperty(formInput.name)
		})
	},

	computed: {
		isValid() {
			if(!this.data.hasTouchedForm) {
				return true
			}

			return notEmptyString(this.data.value)
		}
	},

	blur(evt) {
		this.data.hasTouchedForm = true

		const property = evt.srcElement.name

		formData.setProperty(property, this.data.value)
	},

	update(evt) {
		this.data.value = evt.srcElement.value
	},
}
