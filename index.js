#!/usr/bin/env node

var readline = require('readline');
var shellQuote = require('shell-quote');
var { default: axios } = require('axios');

var [, , endpoint] = process.argv;

(async function () {
	var rl = readline.createInterface(process.stdin, process.stdout);
	rl.prompt();
	for await (var line of rl) {
		if (line == 'exit') break;
		var args = shellQuote.parse(line);
		if (args[0] == 'ls' && args.length == 1) {
			try {
				var response = await axios.get(`${endpoint}/plugin`);
				var plugin = response.data;
				for (var name in plugin)
					console.log(name, '\t', plugin[name].module);
			} catch (e) {
				console.error("error");
			}
		}
		else if (args[0] == 'add' && args.length == 3) {
			var [, name, module] = args;
			try {
				await axios.put(`${endpoint}/plugin/${name}`, { module: module }, { headers: { "Content-Type": "application/json" } });
				console.log(`added ${name}`);
			} catch (e) {
				console.error("error");
			}
		}
		else if (args[0] == 'remove' && args.length == 2) {
			var [, name] = args;
			try {
				await axios.delete(`${endpoint}/plugin/${name}`);
				console.log(`removed ${name}`);
			} catch (e) {
				console.error("error");
			}
		}
		else
			console.log("syntax error");
		rl.prompt();
	}
	rl.close();
})();
