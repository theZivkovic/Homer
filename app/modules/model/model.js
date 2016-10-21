define(['./wall'], function(Wall){

	var Model = function() {

		var self = this;
		var _walls = [];

		self.addWall = function(){
			var newWall = Object.create(Wall.prototype);
			Wall.apply(newWall, arguments);
			_walls.push(newWall);
		}	
	}

	return Model;
});