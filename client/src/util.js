define([
	'jquery', 
	'lodash', 
	'backbone'
],

function($, _, Backbone) {

	return {

		getDistance: function(fromX, fromY, toX, toY) {
			return Math.sqrt(Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2));
		},

		getAngle: function(fromX, fromY, toX, toY) {
			var width = toX - fromX,
				height = fromY - toY,
				angle = Math.abs(Math.atan(height/width)*180/Math.PI) || 0;
			if (toY >= fromY) {
				if (toX < fromX) {
					angle = 180 - angle;
				}
			} else if (toY < fromY) {
				if (toX < fromX) {
					angle += 180
				} else {
					angle = 360 - angle;
				}
			}
			return angle;
		}

	};

});