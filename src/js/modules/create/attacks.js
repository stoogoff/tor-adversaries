
import { throwIfNullOrEmpty, isNull } from 'q/utils/assert.js'
import { AttackPropertiesMap } from 'utils/config.js'
import { logger } from 'utils/logger.js'
import { showToast } from 'utils/lib.js'
import { chosenAttackStore } from 'create/stores.js'

export default {
	data: {
		attack: '',
		skill: null,
		damage: null,
		injury: null,
		properties: null,
	},

	computed: {
		availableProperties() {
			return Object.keys(AttackPropertiesMap).map(value => ({ value }))
		},
	},

	addAttack(evt, context) {
		const attack = {
			attack: this.data.attack,
			skill: this.data.skill,
			damage: this.data.damage,
			injury: this.data.injury,
			properties: isNull(this.data.properties) ? [] : [this.data.properties],
		}

		try {
			throwIfNullOrEmpty(attack.attack, 'attack', 'Please fill in the attack name field.')
			throwIfNullOrEmpty(attack.skill, 'skill', 'Please fill in the skill field.')
			throwIfNullOrEmpty(attack.damage, 'damage', 'Please fill in the damage field.')
			throwIfNullOrEmpty(attack.injury, 'injury', 'Please fill in the injury field.')
		}
		catch(error) {
			logger().error(error)
			showToast(error.message)

			return
		}

		chosenAttackStore.add(attack)

		this.data.attack = ''
		this.data.skill = null
		this.data.damage = null
		this.data.injury = null
		this.data.properties = null
	}
}
