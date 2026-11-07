
import { notEmptyString } from 'q/utils/assert.js'
import { MergeStatus } from 'utils/config.js'
import { equals, isValidAdversary } from 'utils/lib.js'

export class FileModel {
	#file
	#custom
	#error = null
	#adversaries = []

	constructor(file, custom) {
		this.#file = file
		this.#custom = custom
	}

	get name() {
		return this.#file.name
	}

	get validFile() {
		return this.#file.name.endsWith('json')
			|| this.#file.type === 'application/json'
			|| this.#file.type === 'text/json'
	}

	get error() {
		return this.#error
	}

	get hasError() {
		return notEmptyString(this.#error)
	}

	read() {
		return new Promise((resolve, reject) => {
			if(!this.validFile) {
				this.#error = 'File is not a JSON file.'
				reject(this.#error)
				return
			}

			const reader = new FileReader()

			reader.onload = evt => {
				try {
					this.parseAdversaries(JSON.parse(evt.target.result))
					resolve(this.#adversaries)
				}
				catch(error) {
					this.#error = 'Failed to parse JSON file.'
					reject(error.message)
				}

			}

			reader.readAsText(this.#file)
		})
	}

	parseAdversaries(content) {
		this.#adversaries = content.map(item => {
			const match = this.#custom.find(
				existing =>
					existing._customId === item._customId || existing.title === item.title
			)

			const exact = equals(item, match)

			let status = MergeStatus.ADD

			if(!isValidAdversary(item)) {
				status = MergeStatus.INVALID
			}
			else if(match && exact) {
				status = MergeStatus.IGNORE
			}
			else if(match && !exact) {
				status = MergeStatus.OVERWRITE
			}

			return {
				adversary: item,
				match,
				status,
			}			
		})
	}

	get adversaries() {
		return this.#adversaries
	}

	get render() {
		return this.adversaries.map(item => {
			let badge = null

			switch(item.status) {
				case MergeStatus.IGNORE:
					badge = '<span class="badge">Ignore</span>'
					break
				case MergeStatus.OVERWRITE:
					badge = '<span class="badge error">Overwrite</span>'
					break
				case MergeStatus.INVALID:
					badge = '<span class="badge">Invalid</span>'
					break
				default:
					badge = '<span class="badge success">Add</span>'
			}

			return `<tr>
				<td class="left">${item.adversary.title}</td>
				<td class="left">${item.match?.title ?? '—'}</td>
				<td class="right">${badge}</td>
			</tr>`
		}).join('')
	}
}
