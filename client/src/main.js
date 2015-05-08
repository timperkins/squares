require([
	'jquery',
	'lodash',
	'backbone',
	'./home/home-view',
	'./components/block-collection',
	'./obstacle/obstacle-collection',
	'./obstacle/obstacle-view'
],

function($, _, Backbone, HomeView, blockCollection, obstacleCollection, ObstacleView) {

	var AppRouter = Backbone.Router.extend({
		
		currentView: {},
		
		routes: {
			"": "loadHome",
			"test": "loadTest"
		},

		initialize: function() {
			this.blockCollection = blockCollection;
			this.obstacleCollection = obstacleCollection;
		},

		addObstacle: function(obstacle) {
			var obstacleView = new ObstacleView({model: obstacle});
			$('#obstacles').append(obstacleView.render().el);
		},

		loadHome: function() {
			var self = this;
			self.homeView = new HomeView();
			self.homeView.render();

			this.blockCollection.add([{
				x: 100,
				y: 100
			}, {
				x: 300,
				y: 400
			}, {
				x: 300,
				y: 100
			}, {
				x: 600,
				y: 450
			}]);

			this.listenTo(this.obstacleCollection, 'add', this.addObstacle);

			this.obstacleCollection.add([{
				left: 0,
				top: 0,
				width: 1400,
				height: 50
			}, {
				left: 1350,
				top: 0,
				width: 50,
				height: 700
			}, {
				left: 0,
				top: 0,
				width: 50,
				height: 700
			}, {
				left: 0,
				top: 650,
				width: 1400,
				height: 50
			}, {
				left: 200,
				top: 0,
				width: 50,
				height: 400
			}, {
				left: 400,
				top: 300,
				width: 50,
				height: 400
			}, {
				left: 600,
				top: 300,
				width: 600,
				height: 50
			}, {
				left: 950,
				top: 0,
				width: 50,
				height: 450
			}, {
				left: 700,
				top: 400,
				width: 150,
				height: 150
			}]);

			// _.each(obstacles, function(o) {
			// 	var obstacle = self.obstacleCollection.create(o),
			// 		obstacleView = new ObstacleView({ model: obstacle });
			// 	obstacleView.render();
			// });

		},

		loadTest: function() {
			this.homeView = new HomeView();
			this.homeView.render();

			this.blockCollection.add([{
				x: 200,
				y: 300
			}, {
				x: 500,
				y: 300
			}]);

		}

	});

	window.app = new AppRouter();
	Backbone.history.start();

}); 