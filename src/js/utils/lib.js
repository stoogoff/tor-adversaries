
import { notNull } from 'q/utils/assert.js'

/**
 * Menu opening and closing.
 */
const handleMenuChange = action => {
	return () => {
		const nav = document.getElementsByTagName('nav')

		if(notNull(nav[0])) {
			nav[0].classList[action]('active')
		}

		document.getElementById('backdrop').classList[action]('active')
	}
}

export const openMenu = handleMenuChange('add')
export const closeMenu = handleMenuChange('remove')
export const toggleMenu = handleMenuChange('toggle')

/**
 * Versioning path for fetch requests.
 */
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

/**
 * Modal opening and closing.
 */
export const openCreateModal = () => {
	document.getElementById('create-modal').show()
	document.getElementById('backdrop').classList.add('full-screen')
	openBackdrop()
}
export const closeCreateModal = () => {
	document.getElementById('create-modal').close()
	document.getElementById('backdrop').classList.remove('full-screen')
	closeBackdrop()
}

/**
 * Backdrop opening and closing.
 */
export const openBackdrop = () => document.getElementById('backdrop').classList.add('active')
export const closeBackdrop = () => document.getElementById('backdrop').classList.remove('active')
export const toggleBackdrop = () => document.getElementById('backdrop').classList.toggle('active')

/**
 * Ability property conversion.
 */
export const convertAbilityText = ({ text, rank, hateOrResolve, group }) => text
	.replace(/:rank:/g, rank)
	.replace(/:hate:/g, hateOrResolve)
	.replace(/:group:/g, group)
	.replace(/\s\*/g, ' <em>')
	.replace(/\*([\s\.,])/g, '</em>$1')

/**
 * Display toast message.
 */
export const showToast = text => {
	const toast = document.getElementById('toast')

	if(toast.style.display === 'flex') {
		toast.style.display = 'none'
	}

	window.setTimeout(() => {
		toast.innerText = text
		toast.style.display = 'flex'
	}, 0)
}

/**
 * Close menus from menu buttons.
 */
export const closeMenuButtonMenus = () => {
	const menus = Array.from(document.getElementsByClassName('btn-menu'))

	for(const menu of menus) {
		menu.removeAttribute('open')
	}
}
