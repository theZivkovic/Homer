define(['./wall'], function(Wall){

	var Model = function() {

		var self = this;
		var _walls = [];
		var _nextWallID = 0;

		self.addWall = function(newWall){
			newWall.setWallID(_nextWallID);
			_nextWallID++;

			_walls.push(newWall);
		}

		self.getWallByID = function(someWallID){
			var foundWall = _walls.find(function(wall){
				return wall.getWallID() == someWallID;
			});

			if (!foundWall)
				throw "Model::getWallByID(): Wall with " + someWallID + " not found!";
			return foundWall;
		}
	}

	return Model;
});