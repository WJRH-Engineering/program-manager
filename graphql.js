const graphql = require("graphql")
const fs = require("fs")

const teal = require('./teal.js')
const js_search = require('js-search')

const { to } = require('utils')

const schema_text = fs.readFileSync("./schema.gql").toString()
const schema = graphql.buildSchema(schema_text)

const resolver = {}

resolver.program = async function(args) {
	const program = await teal.fetch(`programs/${args.id || args.shortname}`)
	return program
}

resolver.programs = async function({ search_param, limit_to, deep }) {
	//get programs from teal
	let [err, programs] = await to(teal.fetch(`organizations/wjrh`))

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

resolver.episode = async function({ id }){
	const episode = await teal.fetch(`episodes/${id}`)
}

resolver.new_program = async function({ name, author, owners }){
	
}

exports.schema = schema
exports.resolver = resolver

exports.query = function(query){
	return graphql.graphql(schema, query, resolver)
}