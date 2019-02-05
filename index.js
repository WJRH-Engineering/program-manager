const express = require("express")
const graphqlHTTP = require('express-graphql');
const cors = require('cors')

const log = require('./log.js')

const teal = require("./graphql.js")

const app = express();

app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema: teal.schema,
  rootValue: teal.resolver,
  graphiql: true,
}));

app.listen(4000);



const fetch = require("node-fetch")

const run = async function(){
	const url = `http://api.teal.cool/whoami`
	const api_key = 'PoJbDelmqrcD/dX2WMKgPVE3OJ+38IAAlNeIE3NMIcvX4FHlahhQj7HI5vc4gsHqPT1apBixMgSe+Lwopow0qA=='

	const data = {
		name: "TooManyCooks",
		shortname: "tooooo-mannny-cooooks"
		// "owners": ["connorwiniarczyk@gmail.com"],
		// "organizations": ["wjrh"],
		// "stream": "http://wjrh.org:8000/WJRHlow"
	}

	console.log(JSON.stringify(data))

	const request = fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			'teal-api-key': api_key
		},
		// method: "POST",
		// body: JSON.stringify(data)
	})
	.then(res => res.json())

	const result = await request
	console.log(result)
}

run()

// const test_query = `
// 	query {
// 		programs(limit_to: 10) {
// 			shortname
// 		}
// 	}`

// const test = async function(){
// 	const req = fetch("http://localhost:4000/graphql", {
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify({query: test_query, raw: true}),
// 		method: "POST"
// 	}).then(res => res.json())

// 	log.debug('performing a brief test...')
// 	const result = await req
// 	console.log(result.error || result.data)
// }

// test()