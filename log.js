const bunyan = require('bunyan')
const prettyStream = require('bunyan-prettystream')

const stream = require('stream')
const fetch = require('node-fetch')

const out_pretty = new prettyStream
out_pretty.pipe(process.stdout)

// const remote_url = 'http://45.55.38.183:4002/log'
const remote_url = "http://45.55.38.183:4002/log"

const remote = new stream.Writable({
	write: async function(chunk, encoding, next){
		fetch(remote_url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify({ 
				event: "LOG",
				data: chunk.toString('utf8'),
				sender: "(N)EAL" 
			})
		}).catch(err => {})
		next()
	}
})

const log = bunyan.createLogger({
	name: "neal",
	streams: [
	{
		level: 'debug',
		type: 'raw',
		stream: out_pretty
	},
	{
		level: 'info',
		type: 'stream',
		stream: remote
	}
	]
})

module.exports = log