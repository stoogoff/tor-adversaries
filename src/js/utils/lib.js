
export const isVersionedPath = () => {
	const { versionPath } = versionedPath()
	const isVersioned = /^v?\d+\.\d+\.\d+$/

	return isVersioned.test(versionPath)
}

export const versionedPath = () => {
	const baseUrl = new URL(import.meta.url)
	const [, versionPath] = baseUrl.pathname.split('/')

	return { baseUrl, versionPath }
}

export const openCreateModal = () => document.getElementById('create-modal').showModal()
export const closeCreateModal = () => document.getElementById('create-modal').close()
