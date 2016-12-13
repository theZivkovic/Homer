define(['src/utils/angleUtil'], function(AngleUtil){

	var Wall = function(startPoint2D, direction2D, wallLength, wallHeight, wallThickness, scene) {

		var self = this;

		var _wallID = -1;
		var _startPoint2D = startPoint2D;
		var _direction2D = direction2D;
		var _direction3D = new BABYLON.Vector3(_direction2D.x, 0.0, _direction2D.y);
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

		function _pointBelongsToPlane(point, planeOrigin, planeNormal){
			let EPS = 0.001;
			return Math.abs(BABYLON.Vector3.Dot(point.subtract(planeOrigin), planeNormal)) < EPS;
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
			_underlyingBox.refreshBoundingInfo();
		}
		
		self.changeWallLength = function(newWallLength){
			_wallLength = newWallLength;
			_updateUnderlyingBox();
		}

		self.changeWallHeight = function(newWallHeight){
			_wallHeight = newWallHeight;
			_updateUnderlyingBox();
		}

		self.setWallID = function(newWallID) {
			_wallID = newWallID;
			_underlyingBox.name = "wall#" + newWallID;
		}

		self.getWallID = function(){
			return _wallID;
		}

		self.getDirectionGroundSpace = function(){
			return _direction2D;
		}

		self.getEndingPointGroundSpace = function(){
			return _startPoint2D.add(_direction2D.scale(_wallLength));
		}

		self.getWallHeight = function(){
			return _wallHeight;
		}

		self.getWallThickness = function(){
			return _wallThickness;
		}

		self.getPickedSide = function(pickedPoint){

			var frontPlaneOrigin = _underlyingBox.position.add(_direction3D.scale(_wallLength / 2.0));
			if (_pointBelongsToPlane(pickedPoint, frontPlaneOrigin, _direction3D))
				return "front";
			
			var rearPlaneOrigin = _underlyingBox.position.add(_direction3D.negate().scale(_wallLength / 2.0));
			if (_pointBelongsToPlane(pickedPoint, rearPlaneOrigin, _direction3D.negate()))
				return "rear";

			var leftVector = BABYLON.Vector3.Cross(_direction3D, BABYLON.Vector3.Up());

			var leftPlaneOrigin = _underlyingBox.position.add(leftVector.scale(_wallThickness / 2.0));
			if (_pointBelongsToPlane(pickedPoint, leftPlaneOrigin, leftVector))
				return "left";

			var rightPlaneOrigin = _underlyingBox.position.add(leftVector.negate().scale(_wallThickness / 2.0));
			if (_pointBelongsToPlane(pickedPoint, rightPlaneOrigin, leftVector.negate()))
				return "right";

			

			return "asa";
		}

		_initialize();

	}

	return Wall;
});