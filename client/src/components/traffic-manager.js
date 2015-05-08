define([
	'jquery', 
	'lodash', 
	'backbone',
	// '../obstacle/obstacle-collection',
	// './block',
	'./path-manager',
	// './block-collection'
],

function($, _, Backbone, pathManager) {

	var COLLISION_WAIT_TIME = 1000;

	// var MovingBlocks = Backbone.Collection.extend({

	// 	url: 'moving-blocks',

	// 	model: Block

	// });

	var TrafficManager = Backbone.Model.extend({

		initialize: function() {
			// this.obstacleCollection = obstacleCollection;
			this.pathManager = pathManager;
			// this.blockCollection = blockCollection;
			// console.log('b', this.blockCollection);
			// this.movingBlocks = new MovingBlocks();
		},

		blockMoved: function(block) {
			var self = this;
			// this.movingBlocks.forEach(function(b) {
			this.get('blockCollection').forEach(function(b) {
				if (block == b) { return; }
				if (block.collidesWith(b)) {
					console.log('collides');
					block.set('stop', true);
					b.set('stop', true);
					self.setNewBlockPath(block, b);
					block.set('stop', false);
					setTimeout(function() {
						self.setNewBlockPath(b, block);
						b.set('stop', false);
					}, COLLISION_WAIT_TIME);
				}
			});
		},

		setNewBlockPath: function(block, goAroundBlock) {
			var path = pathManager.findShortestPath({
				block: block, 
				goAroundBlock: goAroundBlock,
				fromX: block.get('x'), 
				fromY: block.get('y'), 
				toX: block.get('moveToX'), 
				toY: block.get('moveToY')
			});
			block.set('movePath', path);
		},

		blockStartMove: function(block) {
			// this.movingBlocks.push(block);
		},

		blockStopMove: function(block) {
			// this.movingBlocks.remove(block);
			// console.log('blockStopMove');
		}

	});

	return new TrafficManager();

});