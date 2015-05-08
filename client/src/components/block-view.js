define([
	'jquery', 
	'lodash', 
	'backbone', 
	'text!./block-tpl.html',
	'util',
	'../selection/selection'
],

function($, _, Backbone, templateFile, util, selection) {

	var TheView = Backbone.View.extend({

		events: {
			'click': 'click'
		},

		initialize: function() {
			this.template = _.template(templateFile);
			this.$el.addClass('block');
			this.selectedBlocks = selection.get('blocks');
			this.listenTo(this.model, 'change:active', this.changeActiveState);
			this.listenTo(this.model, 'change:movePath', this.moveAlongPath);
			this.listenTo(this.model, 'change:stop', this.stop);
			// this.listenTo(this.selectedBlocks, '')
			$.queue(this.$el, 'move');
		},

		render: function() {
			this.$el.css({
				width: this.model.get('width'),
				height: this.model.get('height')
			});
			var x = this.model.get('x'),
				y = this.model.get('y');
			this.model.set({
				moveToX: x,
				moveToY: y
			})
			this.moveTo(x, y, x, y);
			return this;
		},

		changeActiveState: function() {
			this.$el.toggleClass('active', this.model.get('active'));
		},

		click: function(e) {
			e.stopPropagation();
			this.selectedBlocks.reset(this.model);
		},

		stop: function() {
			if (!this.model.get('stop')) { return; }
			this.$el.stop(true);
		},

		moveTo: function(fromX, fromY, toX, toY, stop) {
			var self = this,
				left = toX - (this.model.get('width') / 2),
				top = toY - (this.model.get('height') / 2),
				distance = util.getDistance(fromX, fromY, toX, toY),
				time = distance / this.model.get('speed'),
				angle = util.getAngle(fromX, fromY, toX, toY);
			if (stop) {
				this.$el.stop(true);
			}

			this.$el.animate({
				left: left,
				top: top
			}, {
				duration: time,
				start: function() {
					self.rotate(angle);
					self.model.set('moving', true);
				},
				progress: function() {
					self.model.set('x', parseInt(self.$el.css('left')) + (self.model.get('width') / 2));
					self.model.set('y', parseInt(self.$el.css('top')) + (self.model.get('height') / 2));
				},
				complete: function() {
					self.model.set('moving', false);
					// self.model.set({
					// 	x: self.model.get('moveToX'),
					// 	y: self.model.get('moveToY'),
					// 	moving: false
					// });
				}
			}).promise(function() {
			});
		},

		curAngle: 0,

		rotate: function(angle) {
			var self = this;
			var cssAngle = angle;
			// this.prevAngle = this.curAngle;
			// this.curAngle = angle;
			if (Math.abs(angle - this.curAngle) > 180) {
				if (angle > 180) {
					cssAngle -= 360;
				} else {
					cssAngle += 360;
				}	
			}

			// this.$el.text(angle).css('transform', 'rotate(' + angle + 'deg)');
			this.$el.css('transform', 'rotate(' + cssAngle + 'deg)');
			setTimeout(function() {
				self.$el
					.addClass('reset')
					.css('transform', 'rotate(' + angle + 'deg)');
				setTimeout(function() {
					self.$el.removeClass('reset');
				}, 200);
			}, 600);
			this.curAngle = angle;
		},

		moveAlongPath: function() {
			var self = this,
				movePath = this.model.get('movePath');
			_.each(movePath, function(node, i) {
				var fromX = (i === 0) ? self.model.get('x') : movePath[i-1].x,
					fromY = (i === 0) ? self.model.get('y') : movePath[i-1].y;
				self.moveTo(fromX, fromY, node.x, node.y, i === 0);
			});
		},

	});

	return TheView;

});