const Main = {}

Main.load_program = async function(shortname){

	const query = `{
		program(shortname: "${shortname}"){
			name
			shortname
			author
			description
			active
			owners
			image
		}
	}`

	const { program } = await Utils.tealQuery(query)

	const target = Utils.DomQuery('.program-details')[0]
	target.innerHTML = ''

	const details = DomTemplate['program-details'](program)
	target.appendChild(details)

	Utils.DomQuery('.program-details__submit')[0]
	.addEventListener('click', function({ target }){
		const edits = Main.get_edits()
		const shortname = target.getAttribute('data-program')
		Main.update_program(shortname, edits)
	})
}

Main.load_programs = async function(search_param){
	
	const query = `{
		programs(
			search_param: "${search_param}",
			limit_to: 20
		){
			name,
			author,
			shortname
		}
	}`

	const { programs } = await Utils.tealQuery(query)

	const target = Utils.DomQuery('.program-list')[0]
	target.innerHTML = ''

	programs
	.map(DomTemplate['program-link'])
	.forEach(function(link){
		target.appendChild(link)
	})
}

Main.update_program = async function(shortname, edits){

	const mutation = `mutation{
		edit_program(
			shortname: "${shortname}",
			data: ${JSON.stringify(edits).replace(/\"([^(\")"]+)\":/g,"$1:")}
		){
			name,
			author,
			shortname
		}
	}`

	console.log(mutation)

	const result = await Utils.tealQuery(mutation).catch(err => console.log(err))

	console.log(result)
}

Main.get_edits = function(){
	let output = {}
	const elements = Utils.DomQuery('[data-field]')

	elements.forEach(element => {
		const field = element.getAttribute('data-field')
		const value = element.innerHTML
		
		output[field] = value
	})

	return output
}

window.onload = function(){
	Main.load_programs("")

	HashLink.on('program', ({ shortname }) => Main.load_program(shortname))

	Utils.DomQuery('.nav__searchbar')[0]
	.addEventListener('input', ({ target }) => Main.load_programs(target.value))
}