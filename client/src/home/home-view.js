define([
	'jquery', 
	'lodash', 
	'backbone',
	'util',
	'text!./home-tpl.html',
	'../components/block-view',
	'../components/block-collection',
	'../components/path-manager',
	'../components/traffic-manager',
	'../obstacle/obstacle-collection',
	'../obstacle/obstacle-view',
	'../selection/selection-view',
	'../selection/selection'
],

function($, _, Backbone, util, homeTemplate, BlockView, blockCollection, pathManager, trafficManager, obstacleCollection, ObstacleView, SelectionView, selection) {

	var HomeView = Backbone.View.extend({

		el: '#content',

		events: {
			'click': 'click',
			'contextmenu': 'rightClick',
			'mousedown': 'mousedown',
			'mouseup': 'mouseup'
		},

		initialize: function(options) {
			this.template = _.template(homeTemplate);
			this.blockCollection = blockCollection;
			this.obstacleCollection = obstacleCollection;
			this.selection = selection;
			this.highlightRegion = this.selection.get('highlightRegion');
			this.selectedBlocks = this.selection.get('blocks');
			this.listenTo(this.blockCollection, 'add', this.addBlock);
			// this.listenTo(this.obstacleCollection, 'add', this.addObstacle); // TODO extend obstacle
			this.listenTo(this.highlightRegion, 'change:drawing', this.updateActiveBlocks);

			trafficManager.set('blockCollection', blockCollection);
			window.o = obstacleCollection;
		},

		render: function(eventName) {
			this.$el.html(this.template());
			this.$blocks = this.$el.find('#blocks');
			// this.$obstacles = this.$el.find('#obstacles');
			this.selectionView = new SelectionView({ model: this.selection });
			return this.el;
		},

		addBlock: function(block) {
			var blockView = new BlockView({model: block});
			this.$blocks.append(blockView.render().el);
		},

		addObstacle: function(obstacle) {
			var obstacleView = new ObstacleView({model: obstacle});
			this.$obstacles.append(obstacleView.render().el);
		},

		click: function(e) {
			if (this.highlightDrawing) { 
				this.highlightDrawing = false;
				return; 
			}

			// var selectedBlocks = this.blockCollection.activeBlock;
			if (!this.selectedBlocks.length) { return; }
			this.selectedBlocks.forEach(function(block) {
					path = pathManager.findShortestPath({
						block: block, 
						fromX: block.get('x'), 
						fromY: block.get('y'), 
						toX: e.pageX, 
						toY: e.pageY
					});
				block.set('movePath', path);
			});
		},

		rightClick: function(e) {
			if (e.altKey) { return; }
			e.preventDefault();
			this.selectedBlocks.reset();
		},

		mousedown: function(e) {
			var self = this;
			this.highlightRegion.set({
				x: e.pageX,
				y: e.pageY,
			});
			this.$el.on('mousemove', function(e) {
				self.setSelectionEndpoint(e);
			});
		},

		mouseup: function(e) {
			this.$el.off('mousemove');
			this.highlightRegion.set('drawing', false);
		},

		setSelectionEndpoint: function(e) {
			this.highlightDrawing = true;
			this.highlightRegion.set({
				endX: e.pageX,
				endY: e.pageY,
				drawing: true
			});
		},

		// findShortestPath: function(params) {
		// 	// var allObstacleVertices = [],
		// 	var allPathNodes = [];
		// 	this.obstacleCollection.forEach(function(obstacle) {
		// 		if (obstacle == params.block) { return; }
		// 		// allObstacleVertices.push(obstacle.getVertices(obstacle.padding));
		// 		allPathNodes = allPathNodes.concat(obstacle.getPathNodes(params.block));
		// 	});

		// 	// console.log('allObstacleVertices', allObstacleVertices);

		// 	var self = this,
		// 		currentNodes = $.extend(true, [], allPathNodes);

		// 	_.each(currentNodes, function(node) {
		// 		node.visited = false;
		// 		node.distance = 9999999999;
		// 	});
		// 	var currentNode = {
		// 		x: params.fromX,
		// 		y: params.fromY,
		// 		visited: false,
		// 		distance: 0,
		// 		beginning: true
		// 	};
		// 	currentNodes.push(currentNode);

		// 	var destinationNode = {
		// 		x: params.toX,
		// 		y: params.toY,
		// 		visited: false,
		// 		distance: 9999999999,
		// 		destination: true
		// 	};
		// 	currentNodes.push(destinationNode);

		// 	while ((currentNode && !currentNode.destination) || _findNumUnvisitedNodes() === 0) {
		// 		currentNode.visited = true;
		// 		_.each(currentNodes, function(node) {
		// 			if (node.visited) { return; }
		// 			if (self.hasCollisions({
		// 				block: params.block,
		// 				fromX: currentNode.x, 
		// 				fromY: currentNode.y, 
		// 				toX: node.x, 
		// 				toY: node.y
		// 			})) { return; }
		// 			var distance = util.getDistance(currentNode.x, currentNode.y, node.x, node.y) + currentNode.distance;
		// 			if (distance < node.distance) {
		// 				node.distance = distance;
		// 				node.prev = currentNode;
		// 			}
		// 		});

		// 		// Find the next smallest node that hasn't been visited, but is reachable
		// 		currentNode = _.filter(currentNodes, function(node) { 
		// 				return !node.visited && node.prev; 
		// 			})
		// 			.sort(function(a, b) { return a.distance - b.distance; })[0];
		// 	}

		// 	if (!currentNode || !currentNode.destination) {
		// 		console.log('unreachable');
		// 		// The destination node is unreachable
		// 		return false;
		// 	}

		// 	// Find the path
		// 	var path = [];
		// 	while (!currentNode.beginning) {
		// 		path.unshift(currentNode);
		// 		currentNode = currentNode.prev;
		// 	}
		// 	// console.log('path', path);
		// 	return path;

		// 	function _findNumUnvisitedNodes() {
		// 		return _.filter(currentNodes, function(node) {
		// 			return !node.visited;
		// 		}).length;
		// 	}
		// },

		// // Check if this path would collide with any of the obstacles
		// hasCollisions: function(params) {
		// 	var hasCollisions = false;
		// 	this.obstacleCollection.forEach(function(obstacle) {
		// 		if (hasCollisions || obstacle == params.block) { return; }
		// 		hasCollisions = obstacle.collidesWithPath(params.block, params.fromX, params.fromY, params.toX, params.toY);
		// 	});
		// 	return hasCollisions;
		// },

	});

	return HomeView;

});