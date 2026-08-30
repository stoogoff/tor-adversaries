
import { join } from '@std/path'

const source = join(Deno.cwd(), 'tools/data/src')
const target = join(Deno.cwd(), 'src/data')

// read and parse JSON files
const readFileAndParse = async file => {
	const data = await Deno.readTextFile(join(source, file))

	return JSON.parse(data)
}

// load abilities
const abilities = await readFileAndParse('abilities.json')
const abilitiesByTitle = new Map()

abilities.forEach(ability => abilitiesByTitle.set(ability.name, ability))

// load adversaries
const adversaryFiles = {
	'Evil Men': 'evil-men.json',
	'Orcs': 'orcs.json',
}
let adversaries = []

for(const [group, file] of Object.entries(adversaryFiles)) {
	const data = await readFileAndParse(file)

	data.forEach(item => item.group = item.group ?? group)
	data.forEach(item => {
		item.abilities = item.abilities.map(title => {
			if(!abilitiesByTitle.has(title)) {
				throw new Error(`Ability "${title}" not found`)
			}

			const ability = { ...abilitiesByTitle.get(title) }
			const hateOrResolve = 'hate' in item.attributes ? 'Hate' : 'Resolve'

			ability.ability = ability.ability
				.replace(/:hate:/g, hateOrResolve)
				.replace(/:group:/g, item.group)
				.replace(/\s\*/g, ' <em>')
				.replace(/\*([\s\.])/g, '</em>$1')

			// :rank: - will need to put this in the stat block

			return ability
		})
	})

	adversaries = [...adversaries, ...data]
}

await Deno.writeTextFile(join(target, 'adversaries.json'), JSON.stringify(adversaries))

console.log(`Written ${adversaries.length} adversaries`)
