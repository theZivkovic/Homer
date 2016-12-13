define(['src/utils/angleUtil'], function(AngleUtil){

	var WallJoint = function(prevWallEndPoint_groundSpace, prevWallDirection_groundSpace, prevWallHeight, preWallThickness, newWallDirection_groundSpace, scene) {

		var self = this;
		var _prevWallEndPoint_groundSpace = prevWallEndPoint_groundSpace;
		var _prevWallDirection_groundSpace = prevWallDirection_groundSpace;
		var _prevWallHeight = prevWallHeight;
		var _preWallThickness = preWallThickness;
		var _newWallDirection_groundSpace = newWallDirection_groundSpace;

		var _bottomSide = null;
		var _topSide = null;

		var _APoint_GroundSpace;
		var _BPoint_GroundSpace;
		var _CPoint_GroundSpace;

		function _initialize() {

			_prevWallDirection_groundSpace.normalize();
			_newWallDirection_groundSpace.normalize();

			_calculateTrianglePointsGroundSpace();
			_initializeBottomSide();
			_initializeTopSide();
			_initializeVerticalSides();
		}

		function _calculateTrianglePointsGroundSpace() {

			var prevWallEndLineDirection_GroundSpace = new BABYLON.Vector2(_prevWallDirection_groundSpace.y, -_prevWallDirection_groundSpace.x);
			prevWallEndLineDirection_GroundSpace.normalize();

			_BPoint_GroundSpace = _prevWallEndPoint_groundSpace.subtract(prevWallEndLineDirection_GroundSpace.scale(_preWallThickness / 2.0));
			_CPoint_GroundSpace = _prevWallEndPoint_groundSpace.add(prevWallEndLineDirection_GroundSpace.scale(_preWallThickness / 2.0));

			var BADir_GroundSpace = new BABYLON.Vector2(_newWallDirection_groundSpace.y, -_newWallDirection_groundSpace.x);
			BADir_GroundSpace.normalize();

			_APoint_GroundSpace = _BPoint_GroundSpace.add(BADir_GroundSpace.scale(_preWallThickness));
		}

		function _initializeBottomSide() {
		
			var A3D = new BABYLON.Vector3(_APoint_GroundSpace.x, 1.0, _APoint_GroundSpace.y);
			var B3D = new BABYLON.Vector3(_BPoint_GroundSpace.x, 1.0, _BPoint_GroundSpace.y);
			var C3D = new BABYLON.Vector3(_CPoint_GroundSpace.x, 1.0, _CPoint_GroundSpace.y);
			var paths1 = [A3D, B3D];
			var paths2 = [A3D, C3D];
			var paths = [paths1, paths2];
			var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", paths, true, false, 0, scene, false, BABYLON.Mesh.DOUBLESIDE);
		}

		function _initializeTopSide() {

			var A3D = new BABYLON.Vector3(_APoint_GroundSpace.x, _prevWallHeight, _APoint_GroundSpace.y);
			var B3D = new BABYLON.Vector3(_BPoint_GroundSpace.x, _prevWallHeight, _BPoint_GroundSpace.y);
			var C3D = new BABYLON.Vector3(_CPoint_GroundSpace.x, _prevWallHeight, _CPoint_GroundSpace.y);
			var paths1 = [A3D, B3D];
			var paths2 = [A3D, C3D];
			var paths = [paths1, paths2];
			var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", paths, true, false, 0, scene, false, BABYLON.Mesh.DOUBLESIDE);
		}

		function _initializeVerticalSides(){

			var A3D_top = new BABYLON.Vector3(_APoint_GroundSpace.x, _prevWallHeight, _APoint_GroundSpace.y);
			var B3D_top = new BABYLON.Vector3(_BPoint_GroundSpace.x, _prevWallHeight, _BPoint_GroundSpace.y);
			var C3D_top = new BABYLON.Vector3(_CPoint_GroundSpace.x, _prevWallHeight, _CPoint_GroundSpace.y);

			var A3D_bottom = new BABYLON.Vector3(_APoint_GroundSpace.x, 0, _APoint_GroundSpace.y);
			var B3D_bottom = new BABYLON.Vector3(_BPoint_GroundSpace.x, 0, _BPoint_GroundSpace.y);
			var C3D_bottom = new BABYLON.Vector3(_CPoint_GroundSpace.x, 0, _CPoint_GroundSpace.y);
			
			var paths1 = [[A3D_bottom, B3D_bottom], [A3D_top, B3D_top]];
			var ribbon1 = BABYLON.Mesh.CreateRibbon("ribbon", paths1, true, false, 0, scene, false, BABYLON.Mesh.DOUBLESIDE);
			var paths2 = [[A3D_bottom, C3D_bottom], [A3D_top, C3D_top]];
			var ribbon2 = BABYLON.Mesh.CreateRibbon("ribbon", paths2, true, false, 0, scene, false, BABYLON.Mesh.DOUBLESIDE);
			var paths3 = [[C3D_bottom, B3D_bottom], [C3D_top, B3D_top]];
			var ribbon3 = BABYLON.Mesh.CreateRibbon("ribbon", paths3, true, false, 0, scene, false, BABYLON.Mesh.DOUBLESIDE);
		}

		self.getNewEndWallStartPointGroundSpace = function(){
			return _BPoint_GroundSpace.add(_APoint_GroundSpace).scale(0.5);
		}

		self.getNewWallDirecitonGroundSpace = function(){
			return _newWallDirection_groundSpace;
		}

		self.getPrevWallHeight = function(){
			return _prevWallHeight;
		}

		self.getPrevWallThickness = function(){
			return _preWallThickness;
		}

		_initialize();

	}

	return WallJoint;
});