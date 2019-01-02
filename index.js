const express = require("express")
const graphqlHTTP = require('express-graphql');
const cors = require('cors')

const fetch = require("node-fetch")

const teal = require("./graphql.js")

const app = express();

app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema: teal.schema,
  rootValue: teal.resolver,
  graphiql: true,
}));

app.listen(4000);

const query = `
	query {
		programs(limit_to: 10) {
			id
		}
	}
`

const test = async function(){
	const req = fetch("http://localhost:4000/graphql", {
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({query: query, raw: true}),
		method: "POST"
	}).then(res => res.json())

	console.log(await req)
}

test()