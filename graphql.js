const fetch = require("node-fetch")
const graphql = require("graphql")
const fs = require("fs")
const NodeCache = require("node-cache")

const js_search = require("js-search")

const cache = new NodeCache()

const cached_fetch = async function(url){
	console.log(cache.getStats())

	const cached = cache.get(url)

	if(cached != undefined) {
		return cached // if the cache didn't miss, return its value
	} else {
		// get the value from the internet
		const value = await fetch(url).then(res => res.json())

		// add the value to our cache with the url as the key
		cache.set(url, value)
		return value
	}
}

const schema_text = fs.readFileSync("./schema.gql").toString()
const schema = graphql.buildSchema(schema_text)

const root = {}

const TEAL_URL = "https://api.teal.cool"

root.program = async function(args) {
	return await cached_fetch(`${TEAL_URL}/programs/${args.id || args.shortname}`)
}

root.programs = async function({ search_param, limit_to, deep }) {
	//get programs from teal
	let programs = await cached_fetch(`${TEAL_URL}/organizations/wjrh`)

	if(search_param) {
		const search = new js_search.Search('name')
		
		search.addIndex('name')
		search.addIndex('author')
		search.addIndex('tags')
		search.addIndex('shortname')
		search.addDocuments(programs)

	 	programs = search.search(search_param)

	 	// console.log(search)
	}
	
	// limit size of results if needed
	if(limit_to) programs = programs.splice(0, limit_to)

	//if we are not doing a deep search, return the results as is
	if(!deep) return programs

	// otherwise, get more details about the programs
	programs = programs.map(async function(program){
		// console.log(program.shortname)
		details = await root.program(program).catch(err => null)

		return { ...details, ...program }
	})
	
	return programs
}

root.episode = args => (
	fetch(`https://api.teal.cool/episodes/${args.id}`)
	.then(res => res.json())
)

exports.schema = schema
exports.resolver = root

exports.query = function(query){
	return graphql.graphql(schema, query, root)
}