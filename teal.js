const log = require('./log')
const fetch = require('node-fetch')
const NodeCache = require("node-cache")

const { to } = require('utils')

const cache = new NodeCache()

const TEAL_URL = "https://api.teal.cool"

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