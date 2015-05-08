define([
	'jquery', 
	'lodash', 
	'backbone',
	'util'
],

function($, _, Backbone, util) {

	var TheModel = Backbone.Model.extend({

		defaults: {
			width: 20,
			height: 20
		},

		initialize: function(params) {
			// Make sure these get set because this is called from other models
			this.set({
				left: params.left,
				top: params.top,
				width: params.width,
				height: params.height
			});
		},

		getLeft: function() {
			return this.get('left');
		},

		getTop: function() {
			return this.get('top');
		},

		getVertices: function(block) {
			var left = this.getLeft();
			return [{
				x: this.getEdge(block, 'left'),
				y: this.getEdge(block, 'top')
			}, {
				x: this.getEdge(block, 'right'),
				y: this.getEdge(block, 'top')
			}, {
				x: this.getEdge(block, 'right'),
				y: this.getEdge(block, 'bottom')
			}, {
				x: this.getEdge(block, 'left'),
				y: this.getEdge(block, 'bottom')
			}];
		},

		// Get an edge of this obstacle (and take into account the padding on the block)
		getEdge: function(block, edge, trim) {
			trim = trim || 1;
			switch(edge) {
				case 'top':
					return this.getTop() - block.get('padding') + trim;
					break;
				case 'right':
					return this.getLeft() + this.get('width') + block.get('padding') - trim;
					break;
				case 'bottom': 
					return this.getTop() + this.get('height') + block.get('padding') - trim;
					break;
				case 'left':
					return this.getLeft() - block.get('padding') + trim;
					break;
			}
		},

		getPathNodes: function(block) {
			return [{
				x: this.getLeft() - block.get('padding'),
				y: this.getTop() - block.get('padding')
			}, {
				x: this.getLeft() + this.get('width') + block.get('padding'),
				y: this.getTop() - block.get('padding')
			}, {
				x: this.getLeft() + this.get('width') + block.get('padding'),
				y: this.getTop() + this.get('height') + block.get('padding')
			}, {
				x: this.getLeft() - block.get('padding'),
				y: this.getTop() + this.get('height') + block.get('padding')
			}];
		},

		collidesWith: function(block) {
			if (block.get('stop')) { return false; }
			return this.getEdge(block, 'top') < block.getEdge(this, 'bottom') &&
				this.getEdge(block, 'bottom') > block.getEdge(this, 'top') &&
				this.getEdge(block, 'left') < block.getEdge(this, 'right') &&
				this.getEdge(block, 'right') > block.getEdge(this, 'left');
		},

		// Check if this obstacle overlaps the line created by the from and to points
		collidesWithPath: function(block, fromX, fromY, toX, toY) {
			var angle = util.getAngle(fromX, fromY, toX, toY),
				minX = Math.min(fromX, toX),
				maxX = Math.max(fromX, toX),
				minY = Math.min(fromY, toY),
				maxY = Math.max(fromY, toY),
				angles = [],
				curAngle = angle,
				vertices = this.getVertices(block);

			_.each(vertices, function(point) {
				if (!((point.x > minX && point.x < maxX) || (point.y > minY && point.y < maxY))) {
					return;
				}
				angles.push(util.getAngle(fromX, fromY, point.x, point.y));
			});

			// Check to see if the angles split the 0/360 line
			var hasFirstQuadrentAngles = false,
				hasFourthQuadrentAngles = false;

			_.each(angles, function(angle) {
				if (angle < 90) {
					hasFirstQuadrentAngles = true;
				}
				if (angle >= 270) {
					hasFourthQuadrentAngles = true;
				}
			});

			if (hasFirstQuadrentAngles && hasFourthQuadrentAngles) {
				if (curAngle < 90) {
					curAngle += 360;
				}
				for (var i=0; i<angles.length; i++) {
					if (angles[i] < 90) {
						angles[i] += 360;
					}
				}
			}

			var maxAngle = Math.max.apply(Math, angles),
				minAngle = Math.min.apply(Math, angles);

			return curAngle > minAngle && curAngle < maxAngle;
		}

	});

	return TheModel;

});