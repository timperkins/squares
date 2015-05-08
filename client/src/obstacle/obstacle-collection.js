define([
	'jquery', 
	'lodash', 
	'backbone',
	'./obstacle'
],

function($, _, Backbone, Obstacle) {

	var TheCollection = Backbone.Collection.extend({

		url: 'obstacle',

		model: Obstacle

	});

	return new TheCollection();

});