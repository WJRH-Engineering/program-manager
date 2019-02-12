const graphql = require("graphql")
const fs = require("fs")

const teal = require('./teal.js')
const js_search = require('js-search')

const { to } = require('utils')

const schema_text = fs.readFileSync("./schema.gql").toString()
const schema = graphql.buildSchema(schema_text)

const root = {}

root.program = async function(args) {
	const program = await teal.fetch(`programs/${args.id || args.shortname}`)
	return program
}

root.programs = async function({ search_param, limit_to, deep, no_cache }) {
	if(no_cache) {
		teal.clear_cache()
	}

	//get programs from teal
	let [err, programs] = await to(teal.fetch(`organizations/wjrh`))

	console.log(search_param)

	if(err) {
		log.error(err.message)
		throw err
	}

	if(search_param) {
		const search = new js_search.Search('name')
		
		search.addIndex('name')
		search.addIndex('author')
		search.addIndex('tags')
		search.addIndex('shortname')
		search.addDocuments(programs)

	 	programs = search.search(search_param)
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

root.episode = async function({ id }){
	const episode = await teal.fetch(`episodes/${id}`)
}

root.new_program = async function({ input }){
	const [ err, result ] = await to(teal.make_program(input))
	if(err) throw err
	return result
}

root.edit_program = async function({ shortname, data }){
	console.log(shortname)
	console.log(data)

	await teal.edit_program(shortname, data)
	teal.clear_cache()
	const updated = await root.program({shortname: data.shortname || shortname})

	return updated
}

exports.schema = schema
exports.root = root

exports.query = function(query){
	return graphql.graphql(schema, query, root)
}