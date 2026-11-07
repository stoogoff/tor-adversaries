
import { logger } from 'utils/logger.js'
import { closeCustomUploadModal, showToast } from 'utils/lib.js'
import { FileModel } from 'utils/file-model.js'
import { Events, MergeStatus } from 'utils/config.js'
import { customStore } from 'tor/stores.js'

export default {
	data: {
		dragging: false,
		fileInput: null,
		files: [],
		errorFiles: [],
	},

	computed: {
		isValid() {
			return this.data.files.length - this.data.errorFiles.length > 0
				&& this.data.files.some(file =>
					file.adversaries.filter(item => 
						item.status === MergeStatus.ADD || item.status === MergeStatus.OVERWRITE
					).length > 0
				)
		},

		dropzoneClass() {
			return this.data.dragging ? 'dropzone highlight' : 'dropzone'
		},
	},

	mounted() {
		this.data.fileInput = this.node.querySelector('input[type=file]')
	},

	selectFileFromInput(evt) {
		if(evt.target.files) {
			this.readFiles(Array.from(evt.target.files))
		}
	},

	openFileDialog(_evt) {
		this.data.fileInput?.click()
	},

	dragenter(evt) {
		evt.preventDefault()

		this.data.dragging = true
		evt.dataTransfer.dropEffect = 'copy'
	},

	dragleave(evt) {
		evt.preventDefault()

		this.data.dragging = false
	},

	drop(evt) {
		evt.preventDefault()

		this.data.dragging = false
		this.readFiles(Array.from(evt.dataTransfer.files))

	},

	async readFiles(files) {
		const updatedFiles = []

		for(const file of files) {
			try {
				const model = new FileModel(file, [ ...customStore.all ])

				updatedFiles.push(model)

				await model.read()
			}
			catch(error) {
				logger().error(error)
				this.data.errorFiles = [...this.data.errorFiles, file]
			}
		}

		this.data.files = [...this.data.files, ...updatedFiles]
	},

	close() {
		this.data.files = []
		this.data.errorFiles = []
		closeCustomUploadModal()
	},

	submit() {
		let saved = 0

		for(const file of this.data.files) {
			if(file.hasError) {
				logger().info(`Skipping file '${file.name}`)
				continue
			}

			for(const item of file.adversaries.filter(item => item.status !== MergeStatus.IGNORE && item.status !== MergeStatus.INVALID)) {
				customStore.add(item.adversary)
				saved++
			}
		}

		if(saved === 0) {
			showToast('Failed to save any adversaries.', 'error')
		}
		else {
			showToast(`Saved ${saved} adversaries.`, 'success')
		}

		this.close()
	},
}
