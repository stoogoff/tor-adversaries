
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
	'Evil Men': { file: 'evil-men.json', source: 'Core Rules' },
	'Orcs': { file: 'orcs.json', source: 'Core Rules' },
	'Trolls': { file: 'trolls.json', source: 'Core Rules' },
	'Undead': { file: 'undead.json', source: 'Core Rules' },
	'Wolves': { file: 'wolves.json', source: 'Core Rules' },
	'Core Characters': { file: 'core-characters.json', source: 'Core Rules' },
	'White Wizard': { file: 'white-wizard.json', source: 'Hand of the White Wizard' },
}

let adversaries = []

// loop through all adversaries, apply abilities, and merge together
for(const [group, obj] of Object.entries(adversaryFiles)) {
	const data = await readFileAndParse(obj.file)

	data.forEach(item => {
		// assign group if not set
		item.group = item.group ?? group

		// assign source based on book
		item.source = obj.source

		// load abilities and add directly to the adversary
		// abilities are parsed to make the following changes:
		// 	:hate: is replaced with either Hate or resolve, whichever the adversary has
		// 	:group: is replaced with the adversary's group property
		// 	*... ...* are replacd with <em> and </em> tags
		// 	:rank: is replaced with the rank from the adversary listing, so Strike Fear:3
		// 		would set the :rank: value in the description to 3
		item.abilities = item.abilities.map(fullTitle => {
			const [title, rank] = fullTitle.split(':')

			if(!abilitiesByTitle.has(title)) {
				throw new Error(`Ability "${title}" not found`)
			}

			const ability = { ...abilitiesByTitle.get(title) }
			const hateOrResolve = 'hate' in item.attributes ? 'Hate' : 'Resolve'

			ability.ability = ability.ability
				.replace(/:rank:/g, rank)
				.replace(/:hate:/g, hateOrResolve)
				.replace(/:group:/g, item.group)
				.replace(/\s\*/g, ' <em>')
				.replace(/\*([\s\.])/g, '</em>$1')

			return ability
		})
	})

	adversaries = [...adversaries, ...data]
}

await Deno.writeTextFile(join(target, 'adversaries.json'), JSON.stringify(adversaries))

console.log(`Written ${adversaries.length} adversaries`)
