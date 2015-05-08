require.config({

	deps: ["main"],

	paths: {
		jquery: "../vendor/jquery/dist/jquery.min",
		lodash: "../vendor/lodash/lodash.min",
		backbone: "../vendor/backbone/backbone",
		text: '../vendor/requirejs-text/text',
		util: './util'
	},

	shim: {
		lodash: {
			exports: '_'
		},
		backbone: {
			deps: ["lodash", "jquery"],
			exports: "Backbone"
		}
	},

	map: {
		"*": {
			underscore: "lodash"
		}
	}
	
});