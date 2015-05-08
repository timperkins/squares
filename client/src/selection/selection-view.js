define([
	'jquery', 
	'lodash', 
	'backbone'
],

function($, _, Backbone) {

	var TheView = Backbone.View.extend({

		el: '#selection',

		initialize: function() {
			this.highlightRegion = this.model.get('highlightRegion');
			this.listenTo(this.highlightRegion, 'change', this.render);
		},

		render: function() {
			this.$el.css({
				left: this.highlightRegion.getX(),
				top: this.highlightRegion.getY(),
				width: this.highlightRegion.getWidth(),
				height: this.highlightRegion.getHeight(),
				display: this.highlightRegion.get('drawing') ? 'inherit' : 'none'
			});
			return this;
		}

	});

	return TheView;

});