define([
	'jquery', 
	'lodash', 
	'backbone',
	'./block'
],

function($, _, Backbone, Block) {

	var BlockCollection = Backbone.Collection.extend({

		url: 'block',

		model: Block,

		initialize: function() {
			// this.on('change:active', this.setActiveBlock);
		},



		// setActiveBlock: function(b) {
		// 	if (!b.get('active')) { return; }
		// 	this.activeBlock = b;
		// 	this.deactivateOtherBlocks(b)
		// },

		// deactivateAllBlocks: function() {
		// 	console.log('deactivateAllBlocks');
		// 	_.each(this.models, function(model) {
		// 		model.set('active', false);
		// 	});
		// },

		// deactivateOtherBlocks: function(activeBlock) {
		// 	console.log('deactivateOtherBlocks');

		// 	_.each(this.models, function(model) {
		// 		if (model != activeBlock) {
		// 			model.set('active', false);
		// 		}
		// 	});
		// }

	});

	return new BlockCollection();

});