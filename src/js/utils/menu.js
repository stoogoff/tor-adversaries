
import { notNull } from 'q/utils/assert.js'

const handleMenuChange = action => {
	return () => {
		const nav = document.getElementsByTagName('nav')

		if(notNull(nav[0])) {
			nav[0].classList[action]('active')
		}
	}
}

export const openMenu = handleMenuChange('add')
export const closeMenu = handleMenuChange('remove')
export const toggleMenu = handleMenuChange('toggle')
