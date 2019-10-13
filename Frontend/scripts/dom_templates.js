DomTemplate = {}

// take an html string and return a dom element defined by that string
DomTemplate.render = function(html) {
	const template = document.createElement('template')
	template.innerHTML = html.trim()
	return template.content
}

DomTemplate["program-link"] = function({ name, author, shortname }){
	const defaultImage = "http://assets.podomatic.net/ts/37/11/dc/cakiral/1400x1400_11741854.jpg"

	const template = `
		<li>
			<a class="list__program-link" href="#program?shortname=${shortname}"
				onclick="Programs.LoadProgram('${shortname}')">
				<span>${name} - ${author}</span>
			</a>
		</li>`

		return DomTemplate.render(template)
}

DomTemplate["program-details"] = function(program){

	const template = `
		<h2>
			<label for="">Name: </label>
			<span class="program-details__name" data-field="name" contenteditable="true">${program.name}</span></h2>
		<h3>
			<label for="">
				Author:
			</label>
			<span class="program-details__name" data-field="author" contenteditable="true">${program.author}</span>
		</h3>
		<p>
			<label for="">Image URL: </label>
			<span program-details__name" data-field="image" contenteditable="true">${program.image}</span>
		</p>			
		<label for="">
			Description: 
		</label>
		<p class="program-details__description" data-field="description" contenteditable="true">${program.description}</p>
		<button class="program-details__submit btn btn--submit" data-program="${program.shortname}">Submit</button>`

	return DomTemplate.render(template)
}