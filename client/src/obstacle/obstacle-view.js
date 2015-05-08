define([
	'jquery', 
	'lodash', 
	'backbone', 
	'text!./obstacle-tpl.html',
],

function($, _, Backbone, templateFile) {

	var TheView = Backbone.View.extend({

		render: function() {
			this.$el.css({
					width: this.model.get('width'),
					height: this.model.get('height'),
					left: this.model.get('left'),
					top: this.model.get('top')
				})
				.addClass('obstacle');
			return this;
		}

	});

	return TheView;

});