const log = require('./log')
const fetch = require('node-fetch')
const NodeCache = require("node-cache")

const { to } = require('utils')

const cache = new NodeCache()

const TEAL_URL = "https://api.teal.cool"
const api_key = 'PoJbDelmqrcD/dX2WMKgPVE3OJ+38IAAlNeIE3NMIcvX4FHlahhQj7HI5vc4gsHqPT1apBixMgSe+Lwopow0qA=='

exports.clear_cache = function() {
	cache.flushAll()
}

exports.fetch = async function(path) {
	const url = `${TEAL_URL}/${path}`
	const cached_data = cache.get(url)

	if(cached_data != undefined) {
		log.info(`cache hit for url: ${url}`)
		return cached_data
	} else {
		log.info(`cache miss for url: ${url}`)

		const request = fetch(url)
		.then(res => {
			if(res.status == 200){
				return res.json()
			} else {
				throw new Error(`request failed with status code: ${res.status}: ${res.statusText}`)
			}
		})
		const [ err, data ] = await to(request)

		if(err) {
			log.error(err.message)
			throw err
		}

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

	// make the request to teal
	const [ err, result ] = await to(request)

	if(err) {
		log.error(`Uh-Oh! Teal didn't like that: ${err.message}`)
		throw err
	}

	return result
}

exports.edit_program = async function(shortname, input){
	const [error, program] = await to(exports.fetch(`programs/${shortname}`))

	if(error) {
		log.error(error.message)
		throw error
	}

	// console.log(program)

	const request = fetch(`${TEAL_URL}/programs/${shortname}`, {
		headers: {
			'Content-Type': 'application/json',
			'teal-api-key': api_key
		},
		method: "POST",
		body: JSON.stringify({...program, ...input})
	})
	.then(res => {
		if(res.status == 200) {
			return res.json()
		} else {
			throw new Error(`\n url: ${TEAL_URL}/programs/${shortname} \n Request failed with status code ${res.status}: ${res.statusText}`)
		}
	})

	const [ err, result ] = await to(request)

	if(err) log.error(err.message)

	return result.data
}

// exports.edit_program('tests2', {name: 'Name2'})