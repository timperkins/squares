define([
	'jquery', 
	'lodash', 
	'backbone',
	'../obstacle/obstacle',
	'../obstacle/obstacle-collection',
	'util',
	'./traffic-manager'
],

function($, _, Backbone, Obstacle, obstacleCollection, util, trafficManager) {

	var allObstacleVertices = [],
		allPathNodes = [];

	var Block = Obstacle.extend({

		defaults: {
			width: 20,
			height: 20,
			speed: 50/1000, // pixels per second
			moving: false,
			moveToX: 0,
			moveToY: 0,
			padding: 15,
			type: 'block'
		},

		movePath: [],

		initialize: function(params) {
			Obstacle.prototype.initialize.call(this, {
				left: this.getLeft(), 
				top: this.getTop(), 
				width: this.get('width'), 
				height: this.get('height')
			});
			var self = this;
			this.setOffsets();
			this.obstacleCollection = obstacleCollection;
			this.obstacleCollection.push(this);
			this.on('change:x', this.onMove);
			this.on('change:y', this.onMove);
			this.on('change:moving', this.onToggleMove);
		},

		onMove: function() {
			trafficManager.blockMoved(this);
		},

		onToggleMove: function() {
			if (this.get('moving')) {
				trafficManager.blockStartMove(this);
			} else {
				trafficManager.blockStopMove(this);
			}
		},

		setOffsets: function() {
			this.set('left', this.get('x') - (this.get('width') / 2));
			this.set('top', this.get('y') - (this.get('height') / 2));
		},

		within: function(coordinates) {
			return this.get('x') < coordinates.right &&
				this.get('x') + this.get('width') > coordinates.left &&
				this.get('y') < coordinates.bottom &&
				this.get('y') + this.get('height') > coordinates.top;
		},

		getLeft: function() {
			return this.get('x') - (this.get('width') / 2);
		},

		getTop: function() {
			return this.get('y') - (this.get('height') / 2);
		},

		// setObstacleInfo: function() {
		// 	if (allObstacleVertices.length === 0) {
		// 		obstacleCollection.forEach(function(obstacle) {
		// 			allObstacleVertices.push(obstacle.get('vertices'));
		// 			allPathNodes = allPathNodes.concat(obstacle.get('pathNodes'));
		// 		});
		// 	}
		// },

		// moveTo: function(toX, toY) {
		// 	this.setObstacleInfo();

		// 	var self = this,
		// 		fromX = this.get('x'),
		// 		fromY = this.get('y'),
		// 		path = this._findShortestPath(fromX, fromY, toX, toY);

		// 	if (path) {
		// 		self.set({
		// 			movePath: path
		// 		});
		// 	}
		// }
	});

	return Block;

});