define(['src/model/fullAngleChooser',
		'src/model/wallJoint'], function(FullAngleChooser, WallJoint){

	var WallBuildingAppendAngleChooserState = function(input, scene, doneCallback){

		var self = this;
		var _scene = scene;
		var _previousWall = input.wall;
		var _previouseWallSide = input.side;

		var _fullAngleChooser = new FullAngleChooser(5.0, _previousWall.getDirectionGroundSpace(), Math.PI / 2.0, _scene);
		var _previousWallEnding_GroundSpace = _previousWall.getEndingPointGroundSpace();
		var _previousWallEnding_WorldSpace = new BABYLON.Vector3(_previousWallEnding_GroundSpace.x, 0.0, _previousWallEnding_GroundSpace.y);
		_fullAngleChooser.setPosition(_previousWallEnding_WorldSpace);
		//_fullAngleChooser.setTextHeight(5.0 + _previousWall.getWallHeight());
		
		self.handleMouseMove = function(event){
			var pickResult = scene.pick(scene.pointerX, scene.pointerY);
			_fullAngleChooser.setDirectionLine(pickResult.pickedPoint);
		}

		self.handleMouseDown = function(event) {
			// do nothing
		}

		self.handleMouseUp = function(event) {
			_fullAngleChooser.showDirectionLines(false);
			_fullAngleChooser.showText(false);
			_fullAngleChooser.showChooser(false);

			var wallJoint = new WallJoint(_previousWall.getEndingPointGroundSpace(),
										  _previousWall.getDirectionGroundSpace(),
										  _previousWall.getWallHeight(),
										  _previousWall.getWallThickness(),
										  _fullAngleChooser.getDirectionVectorGroundSpace(),
										  _scene);

			doneCallback(wallJoint);
		}

		self.getClassname = function(){
			return "WallBuildingAppendAngleChooserState";
		}
	};

	return WallBuildingAppendAngleChooserState;
});