define([], function(){

	var Wall = function(startPoint2D, direction2D, wallLength, wallHeight, startDirectionToSide2D_dirSpace, endDirectionToSide2D_dirSpace, thicknessLeft, thicknessRight, scene) {

		var self = this;

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

		function _calculateEdgeDirection(direction2D, side, directionToSide2D_dirSpace, wallThickness) {

			var normalToDirection2D_groundSpace = new BABYLON.Vector2( -direction2D.y, direction2D.x);

			var directionToSide2D_groundSpace = new BABYLON.Vector2(normalToDirection2D_groundSpace.y * directionToSide2D_dirSpace.x - direction2D.y * directionToSide2D_dirSpace.y,
																  -normalToDirection2D_groundSpace.x * directionToSide2D_dirSpace.x + direction2D.x * directionToSide2D_dirSpace.y);

			directionToSide2D_groundSpace.normalize();

			// now calculate the lenght

			var cosAngle = Math.abs(BABYLON.Vector2.Dot(directionToSide2D_groundSpace, normalToDirection2D_groundSpace));
			var directionToSideDesiredLength = cosAngle == 0 ? wallThickness : wallThickness / cosAngle;

			return directionToSide2D_groundSpace.scale(directionToSideDesiredLength);
		}


		function _endPoint(){

			var endPoint = _startPoint2D.add(_direction2D.scale(_wallLength));
			return endPoint;
		}

		self.updateQuads = function(){

			if (_quadTopModified)
				self.updateTopQuad();
			if (_quadBottomModified)
				self.updateBottomQuad();
			if (_quadLeftModified)
				self.updateLeftQuad();
			if (_quadRightModified)
				self.updateRightQuad();
			if (_quadFrontModified)
				self.updateFrontQuad();
			if (_quadBackModified)
				self.updateBackQuad();
		}

		self.updateTopQuad = function(){

			var rearLeftPoint2D = _startPoint2D.add(_calculateEdgeDirection(_direction2D, "left", _startDirectionToSide2D_dirSpace, _thicknessLeft));
			var frontLeftPoint2D = _endPoint().add(_calculateEdgeDirection(_direction2D, "left", _endDirectionToSide2D_dirSpace, _thicknessLeft));
			var rearRightPoint2D = _startPoint2D.add(_calculateEdgeDirection(_direction2D, "right", _startDirectionToSide2D_dirSpace.negate(), _thicknessRight));
			var frontRightPoint2D =  _endPoint().add(_calculateEdgeDirection(_direction2D, "right", _endDirectionToSide2D_dirSpace.negate(), _thicknessRight));
		
			console.log(rearLeftPoint2D);
			console.log(frontLeftPoint2D);
			console.log(rearRightPoint2D);
			console.log(frontRightPoint2D);

			_topRearLeftPoint = new BABYLON.Vector3(rearLeftPoint2D.x, _wallHeight, rearLeftPoint2D.y);
			_topRearRightPoint = new BABYLON.Vector3(rearRightPoint2D.x, _wallHeight, rearRightPoint2D.y);
			_topFrontLeftPoint = new BABYLON.Vector3(frontLeftPoint2D.x, _wallHeight, frontLeftPoint2D.y);
			_topFrontRightPoint = new BABYLON.Vector3(frontRightPoint2D.x, _wallHeight, frontRightPoint2D.y);

			_bottomRearLeftPoint = new BABYLON.Vector3(rearLeftPoint2D.x, 0.0, rearLeftPoint2D.y);
			_bottomRearRightPoint = new BABYLON.Vector3(rearRightPoint2D.x, 0.0, rearRightPoint2D.y);
			_bottomFrontLeftPoint = new BABYLON.Vector3(frontLeftPoint2D.x, 0.0, frontLeftPoint2D.y);
			_bottomFrontRightPoint = new BABYLON.Vector3(frontRightPoint2D.x, 0.0, frontRightPoint2D.y);


			var topPaths = [ [_topRearLeftPoint, _topFrontLeftPoint], [_topRearRightPoint, _topFrontRightPoint]];
			var bottomPaths = [ [_bottomRearRightPoint, _bottomFrontRightPoint], [ _bottomRearLeftPoint, _bottomFrontLeftPoint]];
			var frontPaths = [ [_bottomFrontRightPoint, _topFrontRightPoint], [_bottomFrontLeftPoint, _topFrontLeftPoint]];
			var rearPaths = [ [_bottomRearLeftPoint, _topRearLeftPoint], [_bottomRearRightPoint, _topRearRightPoint]];
			var leftPaths = [ [_bottomFrontLeftPoint, _topFrontLeftPoint], [_bottomRearLeftPoint, _topRearLeftPoint]];
			var rightPaths = [ [_bottomRearRightPoint, _topRearRightPoint], [_bottomFrontRightPoint, _topFrontRightPoint]];

			var topRibbon = BABYLON.Mesh.CreateRibbon("ribbon", topPaths, false, false, 0, _scene, false, BABYLON.Mesh.FRONTSIDE);
			var bottomRibbon = BABYLON.Mesh.CreateRibbon("ribbon", bottomPaths, false, false, 0, _scene, false, BABYLON.Mesh.FRONTSIDE);
			var frontRibbon = BABYLON.Mesh.CreateRibbon("ribbon", frontPaths, false, false, 0, _scene, false, BABYLON.Mesh.FRONTSIDE);
			var rearRibbon = BABYLON.Mesh.CreateRibbon("ribbon", rearPaths, false, false, 0, _scene, false, BABYLON.Mesh.FRONTSIDE);
			var leftRibbon = BABYLON.Mesh.CreateRibbon("ribbon", leftPaths, false, false, 0, _scene, false, BABYLON.Mesh.FRONTSIDE);
			var rightRibbon = BABYLON.Mesh.CreateRibbon("ribbon", rightPaths, false, false, 0, _scene, false, BABYLON.Mesh.FRONTSIDE);
		}

		self.updateBottomQuad = function(){

		}

		self.updateLeftQuad = function(){

		}

		self.updateRightQuad = function(){

		}

		self.updateFrontQuad = function(){

		}

		self.updateBackQuad = function(){

		}

		// initial step
		_direction2D.normalize();
		_startDirectionToSide2D_dirSpace.normalize();
		_endDirectionToSide2D_dirSpace.normalize();
		self.updateQuads();

	}

	return Wall;
});