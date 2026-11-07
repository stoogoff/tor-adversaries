
import { logger } from 'utils/logger.js'
import { closeCustomUploadModal } from 'utils/lib.js'
import { FileModel } from 'utils/file-model.js'

export default {
	data: {
		dragging: false,
		fileInput: null,
		files: [],
	},

	computed: {
		isValid() {
			return false
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
				const model = new FileModel(file)

				updatedFiles.push(model)

				await model.read()
			}
			catch(error) {
				logger().error(error)
			}
		}

		this.data.files = [...this.data.files, ...updatedFiles]
	},

	cancel() {
		this.data.files = []
		closeCustomUploadModal()
	},

	submit() {

	},
}
