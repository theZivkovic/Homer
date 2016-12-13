define(['src/model/wall'], function(Wall){

	var WallBuildingLengthChooserState = function(input, scene, doneCallback){

		var self = this;
		var _wallDirection_GroundSpace = input.wallDirection;
		var _wallStart_GroundSpace = input.wallStart;
		var _wall = new Wall(_wallStart_GroundSpace, _wallDirection_GroundSpace, 10, 2, 2, scene);

		self.handleMouseMove = function(event){

			var pickedResult = scene.pick(scene.pointerX, scene.pointerY);
			var pickedPoint = pickedResult.pickedPoint;
			var pickedPoint_GroundSpace = new BABYLON.Vector2(pickedPoint.x, pickedPoint.z);

			var startToPickedPoint_GroundSpace = pickedPoint_GroundSpace.subtract(_wallStart_GroundSpace);
			var projectionRatio = BABYLON.Vector2.Dot(startToPickedPoint_GroundSpace, _wallDirection_GroundSpace) /
								  (startToPickedPoint_GroundSpace.length() * _wallDirection_GroundSpace.length());
			var newWallLength = projectionRatio * startToPickedPoint_GroundSpace.length();

			if (newWallLength > 0)
				_wall.changeWallLength(newWallLength);
		}

		self.handleMouseDown = function(event) {
			
		}

		self.handleMouseUp = function(event) {
			doneCallback(_wall);
		}

		self.getClassname = function(){
			return "WallBuildingLengthChooserState";
		}
	};

	return WallBuildingLengthChooserState;
});
