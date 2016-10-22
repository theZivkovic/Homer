define(['src/model/wall'], function(Wall){
	
	var LengthChoosingState = function(wallStart_groundSpace, wallDirection_groundSpace, scene){

		var self = this;
		var _wallStart_groundSpace = wallStart_groundSpace;
		var _wallDirection_groundSpace = wallDirection_groundSpace;
		var _scene = scene;

		var _wall = new Wall("", wallStart_groundSpace, wallDirection_groundSpace, 5, 2, new BABYLON.Vector2(0, 1), new BABYLON.Vector2(0, 1), 1, 1, scene);

		self.handleWallResizing = function(mouseMovePoint2D){

			var toMovePointVector = mouseMovePoint2D.subtract(_wallStart_groundSpace);
			var wallLength = BABYLON.Vector2.Dot(_wallDirection_groundSpace, toMovePointVector) / _wallDirection_groundSpace.length();

			if (wallLength < 0)
				wallLength = 0.0;

			_wall.changeWallLength(wallLength);
		}

		self.handleFinishResizing = function(mouseUpPoint2D){

		}

	}

	return LengthChoosingState;
});