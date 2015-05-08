define([
	'jquery', 
	'lodash', 
	'backbone',
	'../obstacle/obstacle-collection',
	'../util'
],

function($, _, Backbone, obstacleCollection, util) {

	var PathManager = Backbone.Model.extend({

		initialize: function() {
			this.obstacleCollection = obstacleCollection;
		},

		findShortestPath: function(params) {
			params.block.set({
				moveToX: params.toX,
				moveToY: params.toY
			});

			// var allObstacleVertices = [],
			var allPathNodes = [];
			this.obstacleCollection.forEach(function(obstacle) {
				if (obstacle == params.block) { return; }
				if (obstacle.get('type') == 'block' && params.goAroundBlock != obstacle) { return; }
				// allObstacleVertices.push(obstacle.getVertices(obstacle.padding));
				allPathNodes = allPathNodes.concat(obstacle.getPathNodes(params.block));
			});

			// console.log('allObstacleVertices', allObstacleVertices);

			var self = this,
				currentNodes = $.extend(true, [], allPathNodes);

			_.each(currentNodes, function(node) {
				node.visited = false;
				node.distance = 9999999999;
			});
			var currentNode = {
				x: params.fromX,
				y: params.fromY,
				visited: false,
				distance: 0,
				beginning: true
			};
			currentNodes.push(currentNode);

			var destinationNode = {
				x: params.toX,
				y: params.toY,
				visited: false,
				distance: 9999999999,
				destination: true
			};
			currentNodes.push(destinationNode);

			while ((currentNode && !currentNode.destination) || _findNumUnvisitedNodes() === 0) {
				currentNode.visited = true;
				_.each(currentNodes, function(node) {
					if (node.visited) { return; }
					if (self.hasCollisions({
						block: params.block,
						goAroundBlock: params.goAroundBlock,
						fromX: currentNode.x, 
						fromY: currentNode.y, 
						toX: node.x, 
						toY: node.y
					})) { return; }
					var distance = util.getDistance(currentNode.x, currentNode.y, node.x, node.y) + currentNode.distance;
					if (distance < node.distance) {
						node.distance = distance;
						node.prev = currentNode;
					}
				});

				// Find the next smallest node that hasn't been visited, but is reachable
				currentNode = _.filter(currentNodes, function(node) { 
						return !node.visited && node.prev; 
					})
					.sort(function(a, b) { return a.distance - b.distance; })[0];
			}

			if (!currentNode || !currentNode.destination) {
				console.log('unreachable');
				// The destination node is unreachable
				return false;
			}

			// Find the path
			var path = [];
			while (!currentNode.beginning) {
				path.unshift(currentNode);
				currentNode = currentNode.prev;
			}
			// console.log('path', path);
			return path;

			function _findNumUnvisitedNodes() {
				return _.filter(currentNodes, function(node) {
					return !node.visited;
				}).length;
			}
		},

		// Check if this path would collide with any of the obstacles
		hasCollisions: function(params) {
			var hasCollisions = false;
			this.obstacleCollection.forEach(function(obstacle) {
				if (hasCollisions || obstacle == params.block) { return; }
				if (obstacle.get('type') == 'block' && params.goAroundBlock != obstacle) { return; }
				hasCollisions = obstacle.collidesWithPath(params.block, params.fromX, params.fromY, params.toX, params.toY);
			});
			return hasCollisions;
		},

	});

	return new PathManager();

});