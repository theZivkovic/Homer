define(['src/model/wall'], function(Wall){

	var WallBuildingHeightChooserState = function(input, scene, doneCallback){

		var self = this;
		var _wall = input;
		var _initialPointerY = scene.pointerY;

		self.handleMouseMove = function(event){

			var pickResult = scene.pick(scene.pointerX, scene.pointerY);
 			var newWallHeight = -(scene.pointerY - window.innerHeight / 2.0) / 5.0;
			var newWallHeight = (_initialPointerY - scene.pointerY) / 10.0;
			var clampedWallHeight = newWallHeight <= 0.1 ? 0.1 : newWallHeight > 10 ? 10 : newWallHeight;
			_wall.changeWallHeight(clampedWallHeight);
		}

		self.handleMouseDown = function(event) {
			
		}

		self.handleMouseUp = function(event) {
			doneCallback(_wall);
		}

		self.getClassname = function(){
			return "WallBuildingHeightChooserState";
		}
	};

	return WallBuildingHeightChooserState;
});
