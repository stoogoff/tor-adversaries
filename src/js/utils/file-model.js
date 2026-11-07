
export class FileModel {
	#file
	#content = null

	constructor(file) {
		this.#file = file
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
					this.#content = JSON.parse(evt.target.result).map(item => ({
						...item,
						// Keep q happy
						on: () => {},
					}))
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
}
