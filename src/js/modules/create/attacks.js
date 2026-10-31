
import { throwIfNull } from 'q/utils/assert.js'
import { chosenAttackStore } from 'create/stores.js'

export default {
	data: {
		attack: '',
		skill: null,
		damage: null,
		injury: null,
		properties: []
	},

	addAttack(evt, context) {
		const attack = {
			attack: this.data.attack,
			skill: this.data.skill,
			damage: this.data.damage,
			injury: this.data.injury,
			properties: this.data.properties,
		}

		console.log(attack)

		throwIfNull(attack, 'attack')
		throwIfNull(attack.skill, 'skill')
		throwIfNull(attack.damage, 'damage')
		throwIfNull(attack.injury, 'injury')

		chosenAttackStore.add(attack)

		this.data.attack = ''
		this.data.skill = null
		this.data.damage = null
		this.data.injury = null
		this.data.propertise = []
	}
}
