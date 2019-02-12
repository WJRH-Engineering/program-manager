const express = require("express")
const graphqlHTTP = require('express-graphql');
const cors = require('cors')
const path = require('path')

const log = require('./log.js')
const teal = require("./graphql.js")

const app = express();

app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema: teal.schema,
  rootValue: teal.root,
  graphiql: true,
}));

const public = path.join(__dirname, 'Frontend')

app.get('/', function(req, res){
	res.sendFile(`${public}/index.html`)
})

app.use('/', express.static(public))

app.listen(4000);



const fetch = require("node-fetch")

// const run = async function(){
// 	const url = `https://api.teal.cool/programs/`
// 	const api_key = 'PoJbDelmqrcD/dX2WMKgPVE3OJ+38IAAlNeIE3NMIcvX4FHlahhQj7HI5vc4gsHqPT1apBixMgSe+Lwopow0qA=='

// 	const data = {
// 		name: "Test hello",
// 		shortname: "tes-t-hello",
// 		author: "meme",
		
// 		// "owners": ["connorwiniarczyk@gmail.com"],
// 		// "organizations": ["wjrh"],
// 		// "stream": "http://wjrh.org:8000/WJRHlow"
// 	}

// 	// console.log(JSON.stringify(data))

// 	const request = fetch(url, {
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'teal-api-key': api_key
// 		},
// 		method: "POST",
// 		body: JSON.stringify(data)
// 	})
// 	.then(res => {
// 		return res.text()
// 	})

// 	// const result = await request
// 	// console.log(result)
// }

// run()

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