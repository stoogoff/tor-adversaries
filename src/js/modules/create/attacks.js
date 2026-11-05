
import { throwIfNull, isNull } from 'q/utils/assert.js'
import { chosenAttackStore } from 'create/stores.js'
import { AttackPropertiesMap } from 'utils/config.js'

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

		// TODO show toast rather than throw error
		throwIfNull(attack, 'attack')
		throwIfNull(attack.skill, 'skill')
		throwIfNull(attack.damage, 'damage')
		throwIfNull(attack.injury, 'injury')

		chosenAttackStore.add(attack)

		this.data.attack = ''
		this.data.skill = null
		this.data.damage = null
		this.data.injury = null
		this.data.properties = null
	}
}
