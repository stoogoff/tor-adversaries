
import { throwIfNull, isString } from 'q/utils/assert.js'

export class FileModel {
	#file
	#custom
	#content = null

	constructor(file, custom) {
		this.#file = file
		this.#custom = custom
	}

	get name() {
		return this.#file.name
	}

	get valid() {
		return this.#file.name.endsWith('json')
			|| this.#file.type === 'application/json'
			|| this.#file.type === 'text/json'
	}

	get content() {
		return this.#content
	}

	read() {
		return new Promise((resolve, reject) => {
			if(!this.valid) {
				this.#content = 'File is not a JSON file.'
				reject(this.#content)
				return
			}

			const reader = new FileReader()

			reader.onload = evt => {
				try {
					this.#content = JSON.parse(evt.target.result)
					resolve(this.#content)
				}
				catch(error) {
					this.#content = 'Failed to parse JSON file.'
					reject(error.message)
				}
			}

			reader.readAsText(this.#file)
		})
	}

	get render() {
		throwIfNull(this.#content, 'content', 'File must be read before rendering.')

		if(isString(this.#content)) throw new Error('Failed to parse JSON file.')

		// loop over content and display it in a table
		// check to see if this thing already exists
		// if it does show it as different if there are changes
		// otherwise somehow mark it as not needing to be updated

		const html = this.#content.map(item => {
			return `<tr><td>${item.title}</td></tr>`
		}).join('')

		return html
	}
}
