define([], function(){

	var Wall = function(wallID, startPoint2D, direction2D, wallLength, wallHeight, startDirectionToSide2D_dirSpace, endDirectionToSide2D_dirSpace, thicknessLeft, thicknessRight, scene) {

		var self = this;

		var _wallID = wallID;
		var _startPoint2D = startPoint2D;
		var _direction2D = direction2D;
		var _wallLength = wallLength;
		var _wallHeight = wallHeight;
		var _startDirectionToSide2D_dirSpace = startDirectionToSide2D_dirSpace;
		var _endDirectionToSide2D_dirSpace = endDirectionToSide2D_dirSpace;
		var _thicknessLeft = thicknessLeft;
		var _thicknessRight = thicknessRight;
		var _scene = scene;
		
		var _quads = [];

		var _quadTopModified = true;
		var _quadBottomModified = true;
		var _quadLeftModified = true;
		var _quadRightModified = true;
		var _quadFrontModified = true;
		var _quadBackModified = true;

		var _bottomRearLeftPoint = null;
		var _bottomRearRightPoint = null;
		var _bottomFrontLeftPoint = null;
		var _bottomFrontRightPoint = null;
		var _topRearLeftPoint = null;
		var _topRearRightPoint = null;
		var _topFrontLeftPoint = null;
		var _topFrontRightPoint = null;

		var _topPaths = null;
		var _bottomPaths = null;
		var _frontPaths = null;
		var _rearPaths = null;
		var _leftPaths = null;
		var _rightPaths = null;

		var _topRibbon = null;
		var _bottomRibbon = null;
		var _frontRibbon = null;
		var _rearRibbon = null;
		var _leftRibbon = null;
		
		function _initialize(){

			// normalize input
			_direction2D.normalize();
			_startDirectionToSide2D_dirSpace.normalize();
			_endDirectionToSide2D_dirSpace.normalize();

			// initialize ribbons
			_bottomRearLeftPoint = BABYLON.Vector3.Zero();
			_bottomRearRightPoint = BABYLON.Vector3.Zero();
			_bottomFrontLeftPoint = BABYLON.Vector3.Zero();
			_bottomFrontRightPoint = BABYLON.Vector3.Zero();
			_topRearLeftPoint = BABYLON.Vector3.Zero();
			_topRearRightPoint = BABYLON.Vector3.Zero();
			_topFrontLeftPoint = BABYLON.Vector3.Zero();
			_topFrontRightPoint = BABYLON.Vector3.Zero();

			_topPaths = [ [_topRearLeftPoint, _topFrontLeftPoint], [_topRearRightPoint, _topFrontRightPoint]];
			_bottomPaths = [ [_bottomRearRightPoint, _bottomFrontRightPoint], [ _bottomRearLeftPoint, _bottomFrontLeftPoint]];
			_frontPaths = [ [_bottomFrontRightPoint, _topFrontRightPoint], [_bottomFrontLeftPoint, _topFrontLeftPoint]];
			_rearPaths = [ [_bottomRearLeftPoint, _topRearLeftPoint], [_bottomRearRightPoint, _topRearRightPoint]];
			_leftPaths = [ [_bottomFrontLeftPoint, _topFrontLeftPoint], [_bottomRearLeftPoint, _topRearLeftPoint]];
			_rightPaths = [ [_bottomRearRightPoint, _topRearRightPoint], [_bottomFrontRightPoint, _topFrontRightPoint]];

			_topRibbon = BABYLON.Mesh.CreateRibbon("topRibbon#" + _wallID, _topPaths, false, false, 0, _scene, true, BABYLON.Mesh.FRONTSIDE);
			_bottomRibbon = BABYLON.Mesh.CreateRibbon("bottomRibbon#" + _wallID, _bottomPaths, false, false, 0, _scene, true, BABYLON.Mesh.FRONTSIDE);
			_frontRibbon = BABYLON.Mesh.CreateRibbon("frontRibbon#" + _wallID, _frontPaths, false, false, 0, _scene, true, BABYLON.Mesh.FRONTSIDE);
			_rearRibbon = BABYLON.Mesh.CreateRibbon("rearRibbon#" + _wallID, _rearPaths, false, false, 0, _scene, true, BABYLON.Mesh.FRONTSIDE);
			_leftRibbon = BABYLON.Mesh.CreateRibbon("leftRibbon#" + _wallID, _leftPaths, false, false, 0, _scene, true, BABYLON.Mesh.FRONTSIDE);
			_rightRibbon = BABYLON.Mesh.CreateRibbon("rightRibbon#" + _wallID, _rightPaths, false, false, 0, _scene, true, BABYLON.Mesh.FRONTSIDE);

			_updateEdgePoints();
			_updateQuads();
		}

		function _calculateEdgeDirection(direction2D, side, directionToSide2D_dirSpace, wallThickness) {

			var normalToDirection2D_groundSpace = new BABYLON.Vector2( -direction2D.y, direction2D.x);

			var directionToSide2D_groundSpace = new BABYLON.Vector2(normalToDirection2D_groundSpace.y * directionToSide2D_dirSpace.x - direction2D.y * directionToSide2D_dirSpace.y,
																  -normalToDirection2D_groundSpace.x * directionToSide2D_dirSpace.x + direction2D.x * directionToSide2D_dirSpace.y);

			directionToSide2D_groundSpace.normalize();

			// now calculate the length

			var cosAngle = Math.abs(BABYLON.Vector2.Dot(directionToSide2D_groundSpace, normalToDirection2D_groundSpace));
			var directionToSideDesiredLength = cosAngle == 0 ? wallThickness : wallThickness / cosAngle;

			return directionToSide2D_groundSpace.scale(directionToSideDesiredLength);
		}


		function _endPoint(){

			var endPoint = _startPoint2D.add(_direction2D.scale(_wallLength));
			return endPoint;
		}

		function _updateQuads() {

			if (_quadTopModified){
				_updateTopQuad();
				_quadTopModified = false;
			}
			if (_quadBottomModified){
				_updateBottomQuad();
				_quadBottomModified = false;
			}
			if (_quadLeftModified){
				_updateLeftQuad();
				_quadLeftModified = false;
			}
			if (_quadRightModified){
				_updateRightQuad();
				_quadRightModified = false;
			}
			if (_quadFrontModified){
				_updateFrontQuad();
				_quadFrontModified = false;
			}
			if (_quadBackModified){
				_updateBackQuad();
				_quadBackModified = false;
			}
		}

		function _updateEdgePoints() {

			var rearLeftPoint2D = _startPoint2D.add(_calculateEdgeDirection(_direction2D, "left", _startDirectionToSide2D_dirSpace, _thicknessLeft));
			var frontLeftPoint2D = _endPoint().add(_calculateEdgeDirection(_direction2D, "left", _endDirectionToSide2D_dirSpace, _thicknessLeft));
			var rearRightPoint2D = _startPoint2D.add(_calculateEdgeDirection(_direction2D, "right", _startDirectionToSide2D_dirSpace.negate(), _thicknessRight));
			var frontRightPoint2D =  _endPoint().add(_calculateEdgeDirection(_direction2D, "right", _endDirectionToSide2D_dirSpace.negate(), _thicknessRight));

			_topRearLeftPoint.copyFrom(new BABYLON.Vector3(rearLeftPoint2D.x, _wallHeight, rearLeftPoint2D.y));
			_topRearRightPoint.copyFrom(new BABYLON.Vector3(rearRightPoint2D.x, _wallHeight, rearRightPoint2D.y));
			_topFrontLeftPoint.copyFrom(new BABYLON.Vector3(frontLeftPoint2D.x, _wallHeight, frontLeftPoint2D.y));
			_topFrontRightPoint.copyFrom(new BABYLON.Vector3(frontRightPoint2D.x, _wallHeight, frontRightPoint2D.y));
			_bottomRearLeftPoint.copyFrom(new BABYLON.Vector3(rearLeftPoint2D.x, 0.0, rearLeftPoint2D.y));
			_bottomRearRightPoint.copyFrom(new BABYLON.Vector3(rearRightPoint2D.x, 0.0, rearRightPoint2D.y));
			_bottomFrontLeftPoint.copyFrom(new BABYLON.Vector3(frontLeftPoint2D.x, 0.0, frontLeftPoint2D.y));
			_bottomFrontRightPoint.copyFrom(new BABYLON.Vector3(frontRightPoint2D.x, 0.0, frontRightPoint2D.y));
		}

		function _updateTopQuad() {
			_topRibbon = BABYLON.Mesh.CreateRibbon(null, _topPaths, null, null, null, null, null, null, _topRibbon);
			_topRibbon.refreshBoundingInfo();
		}

		function _updateBottomQuad() {
			_bottomRibbon = BABYLON.Mesh.CreateRibbon(null, _bottomPaths, null, null, null, null, null, null, _bottomRibbon);
			_bottomRibbon.refreshBoundingInfo();
		}

		function _updateLeftQuad() {
			_leftRibbon = BABYLON.Mesh.CreateRibbon(null, _leftPaths, null, null, null, null, null, null, _leftRibbon);
			_leftRibbon.refreshBoundingInfo();
		}

		function _updateRightQuad() {
			_rightRibbon = BABYLON.Mesh.CreateRibbon(null, _rightPaths, null, null, null, null, null, null, _rightRibbon);
			_rightRibbon.refreshBoundingInfo();
		}

		function _updateFrontQuad() {
			_frontRibbon = BABYLON.Mesh.CreateRibbon(null, _frontPaths, null, null, null, null, null, null, _frontRibbon);
			_frontRibbon.refreshBoundingInfo();
		}

		function _updateBackQuad() {
			_rearRibbon = BABYLON.Mesh.CreateRibbon(null, _rearPaths, null, null, null, null, null, null,_rearRibbon);
			_rearRibbon.refreshBoundingInfo();
		}

		self.changeWallLength = function(newWallLength){

			_wallLength = newWallLength;

			_updateEdgePoints();

			_quadFrontModified = true;
			_quadLeftModified = true;
			_quadRightModified = true;
			_quadBottomModified = true;
			_quadTopModified = true;

			_updateQuads();
		}

		self.changeWallHeight = function(newWallHeight){

			_wallHeight = newWallHeight;

			_updateEdgePoints();

			_quadTopModified = true;
			_quadLeftModified = true;
			_quadRightModified = true;
			_quadFrontModified = true;
			_quadBackModified = true;

			_updateQuads();
		}

		self.changeColor = function(color){

			var newMaterial = new BABYLON.StandardMaterial("material", scene);
			newMaterial.diffuseColor = color;

			_leftRibbon.material = newMaterial;
			_rightRibbon.material = newMaterial;
			_topRibbon.material = newMaterial;
			_bottomRibbon.material = newMaterial;
			_frontRibbon.material = newMaterial;
			_rearRibbon.material = newMaterial;
		}

		self.getWallEndGroundSpace = function(){
			return _startPoint2D.add(_direction2D.scale(_wallLength));
		}

		_initialize();

	}

	return Wall;
});