const log = require('./log')
const fetch = require('node-fetch')
const NodeCache = require("node-cache")

const { to } = require('utils')

const cache = new NodeCache()

const TEAL_URL = "https://api.teal.cool"
const api_key = 'PoJbDelmqrcD/dX2WMKgPVE3OJ+38IAAlNeIE3NMIcvX4FHlahhQj7HI5vc4gsHqPT1apBixMgSe+Lwopow0qA=='

exports.fetch = async function(path) {
	const url = `${TEAL_URL}/${path}`
	const cached_data = cache.get(url)

	if(cached_data != undefined) {
		log.info(`cache hit for url: ${url}`)
		return cached_data
	} else {
		log.info(`cache miss for url: ${url}`)

		const request = fetch(url).then(res => res.json())
		const data = await request

		cache.set(url, data) // populate the cache
		return data
	}
}

exports.make_program = async function(input){
	if(input.name == undefined){
		throw new Error('missing required field: name')
	}
	if(input.author == undefined){
		throw new Error('missing required field: author')
	}

	// defaults
	const defaults = {
		organizations: ["wjrh"],
		stream: "http://wjrh.org:8000/WJRHlow"
	}

	// create an object by joining the input with the defaults,
	// give priority to input on key collision
	const program = { ...defaults, ...input }

	console.log(JSON.stringify(program))

	const request = fetch(`${TEAL_URL}/programs/`,{
		headers: {
			'Content-Type': 'application/json',
			'teal-api-key': api_key
		},
		method: "POST",
		body: JSON.stringify(program)
	})
	.then(res => {
		if(res.status == 200){
			return res.json()
		} else {
			throw new Error("You probably used a name that was taken")
		}
	})

	const [ err, result ] = await to(request)

	if(err) {
		log.error(`Uh-Oh! Teal didn't like that: ${err.message}`)
		throw err
	}

	return result
}






