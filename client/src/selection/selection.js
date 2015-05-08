define([
	'jquery', 
	'lodash', 
	'backbone',
	'../components/block',
	'../components/block-collection'
],

function($, _, Backbone, Block, blockCollection) {

	var SelectedBlocks = Backbone.Collection.extend({

		url: 'selected-blocks',

		model: Block,

		initialize: function() {
			this.blockCollection = blockCollection;
			this.on('reset', this.updateActiveBlocks);
		},


		updateActiveBlocks: function() {
			this.blockCollection.forEach(function(block) {
				block.set('active', false);
			});
			this.forEach(function(block) {
				block.set('active', true);
			});
		},

		// empty: function() {
		// 	var model;
		// 	console.log('empty', this);
		// 	while (model = this.first()) {
		// 		console.log('m', model);
		// 		model.destr
		// 	}
		// }

	});

	var HighlightRegion = Backbone.Model.extend({

		defaults: {
			x: 0,
			y: 0,
			endX: 0,
			endY: 0
		},

		getX: function() {
			if (this.get('endX') === 0) { return this.get('x'); }
			return Math.min(this.get('x'), this.get('endX'));
		},

		getY: function() {
			if (this.get('endY') === 0) { return this.get('y'); }
			return Math.min(this.get('y'), this.get('endY'));
		},

		getWidth: function() {
			return Math.max(this.get('x'), this.get('endX')) - Math.min(this.get('x'), this.get('endX'));
		},

		getHeight: function() {
			return Math.max(this.get('y'), this.get('endY')) - Math.min(this.get('y'), this.get('endY'));
		},

		getCoordinates: function() {
			return {
				left: this.getX(),
				top: this.getY(),
				right: this.getX() + this.getWidth(),
				bottom: this.getY() + this.getHeight()
			};
		}

	});

	var Selection = Backbone.Model.extend({

		initialize: function() {
			var self = this;
			this.set({
				blocks: new SelectedBlocks(),
				highlightRegion: new HighlightRegion()
			});

			this.blockCollection = blockCollection;
			this.highlightRegion = this.get('highlightRegion');
			this.blocks = this.get('blocks');
			// this.listenTo(this.highlightRegion, 'change:endX', function(highlightRegion) {
			// 	self.setSelection(highlightRegion);
			// 	// self.setSelectedBlocks(highlightRegion);
			// });
			// this.listenTo(this.highlightRegion, 'change:endY', function(highlightRegion) {
			// 	self.setSelection(highlightRegion);
			// 	// self.setSelectedBlocks(highlightRegion);
			// });
			this.listenTo(this.highlightRegion, 'change:drawing', function(highlightRegion) {
				self.setSelection(highlightRegion);
			});
		},

		setSelection: function(highlightRegion) {
			var self = this,
				blocksInHighlightRegion = [];
			this.blockCollection.forEach(function(block) {
				// if (typeof highlightRegion.changed.drawing != 'undefined') { return; }
				if (block.within(self.highlightRegion.getCoordinates())) {
					// console.log('within', self.highlightRegion.getWidth());
					// self.blocks.add(block);
					// console.log('self.blocks', self.blocks);
					blocksInHighlightRegion.push(block);
				}
			});
			this.blocks.reset(blocksInHighlightRegion);

			// // Find out if selected blocks has changed
			// var numFound = 0;
			// this.blocks.forEach(function(block) {
			// 	var blockPos = blocksInHighlightRegion.indexOf(block);
			// 	if (blockPos > -1) {
			// 		numFound++;
			// 	}
			// });
			// console.log(numFound, blocksInHighlightRegion.length);
			// if (numFound !== blocksInHighlightRegion.length) {
			// 	// Reset
			// 	console.log('reset', numFound);
			// 	this.blocks.reset();
			// 	this.blocks.add(blocksInHighlightRegion);
			// }
			
		}

	});

	return new Selection();

});