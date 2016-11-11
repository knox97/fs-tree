#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');

program
	.version('1.0.0')
	.arguments('<req>')
	.description('Builds a folder structure in current directory')
	.action(function(req) {
		console.log("Loading FS tree structure from \'${req}\'");
		console.log("Building FS tree..");
		const dir = __dirname;
		var file = fs.readFileSync(`${dir}/${req}`, 'utf8');
		var tabs = 0;
		var curr_path = [];
		var last_dir = '';

		file = file
			.replace(/^\n+/gi, '')
			.replace(/\n+$/gi, '')
			.replace(/\t+\n/gi, '')
			.match(/[\ta-z\_\-\.0-9]+\n*/gi)
			.map(function(doc) {
				return doc.replace(/\n/gi, '');
			})
			.forEach(function(doc, i) {
				var curr_tabs = doc.match(/\t/gi);
				var curr_tabs = curr_tabs ? curr_tabs.length+1 : 1;
				var isCreate = false;
				doc = doc.replace(/\t/gi, '');
				

				// Its a folder
				if (isFolder(doc)) {
					//console.log(tabs, curr_tabs);
					// folder changed
					if (tabs != curr_tabs) {
						// back
						if (tabs > curr_tabs) {
							while (curr_path.length != curr_tabs-1)
								curr_path.pop();
							curr_path.push(doc);
						}
						// front
						else if (tabs < curr_tabs) {
							curr_path.push(doc);
						}
					}
					// folder same
					else if (tabs == curr_tabs) {
						// not the same folder
						if (last_dir != doc) {
							curr_path.pop();
							curr_path.push(doc);
						}
					}
					// update values
					last_dir = doc;
					tabs = curr_tabs;
				}
				
				if (!isFolder(doc) && 1 == curr_tabs) {
					tabs = 1;
					while (curr_path.length != curr_tabs)
						curr_path.pop();
				}
				else if (!isFolder(doc) && 1 < curr_tabs) {
					while (curr_path.length != curr_tabs-1)
						curr_path.pop();
					tabs = curr_tabs-1;
				}

				if (isFolder(doc)) {
					//console.log(curr_tabs, tabs);
					isCreate = true;
					console.log(`./${curr_path.join('/')}`);
					fs.mkdirSync(`./${curr_path.join('/')}`);
				}

				if (!isCreate && !isFolder(doc)) {
					if (curr_tabs == 1) {
						console.log(`./${doc}`);
						fs.writeFileSync(`./${doc}`, '');
					}
					else {
						console.log(`./${curr_path.join('/')}/${doc}`);
						fs.writeFileSync(`./${curr_path.join('/')}/${doc}`, '');
					}
				}
				
				
			});

		//console.log(tree_source);

		function isFolder(doc) {
			var res = doc.match(/\./gi) ? false : true;
			return res;
		}

		console.log("FS tree created [from knox97js@gmail.com with love :)]");
	});

program.parse(process.argv);
