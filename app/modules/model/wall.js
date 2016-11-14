define(['src/utils/angleUtil'], function(AngleUtil){

	var Wall = function(wallID, startPoint2D, direction2D, wallLength, wallHeight, wallThickness, scene) {

		var self = this;

		var _wallID = wallID;
		var _startPoint2D = startPoint2D;
		var _direction2D = direction2D;
		var _wallLength = wallLength;
		var _wallHeight = wallHeight;
		var _wallThickness = wallThickness;
		var _underlyingBox = null;
		var _scene = scene;
		
		function _initialize() {

			_direction2D.normalize();
			_underlyingBox = BABYLON.Mesh.CreateBox("box", 1.0, _scene);
			_updateUnderlyingBox();
		}

		function _updateUnderlyingBox() {

			// reset the position to worlds center
			_underlyingBox.position = BABYLON.Vector3.Zero();
			_underlyingBox.rotation.y = 0.0;

			// scale it to wallHeight, wallLength, wallThickness
			_underlyingBox.scaling.x = _wallLength;
			_underlyingBox.scaling.y = _wallHeight;
			_underlyingBox.scaling.z = _wallThickness;

			// rotate it properly
			var directionAngle = AngleUtil.convertDirectionVector2DToRadians(_direction2D);
			_underlyingBox.rotation.y = -directionAngle;

			//calculate the new position
			var newPosition2D = _startPoint2D.add(_direction2D.scale(_wallLength / 2.0));
			_underlyingBox.position = new BABYLON.Vector3(newPosition2D.x, _wallHeight / 2.0, newPosition2D.y);
		}
		
		self.changeWallLength = function(newWallLength){
			_wallLength = newWallLength;
			_updateUnderlyingBox();
		}

		self.changeWallHeight = function(newWallHeight){
			_wallHeight = newWallHeight;
			_updateUnderlyingBox();
		}

		self.changeColor = function(color){

		}

		_initialize();

	}

	return Wall;
});