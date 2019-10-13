const express = require("express")
const graphqlHTTP = require('express-graphql')
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