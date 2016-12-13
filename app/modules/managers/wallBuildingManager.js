define([
	'src/model/wall',
	'src/states/wallBuilding/wallBuildingIdleState',
	'src/states/wallBuilding/wallBuildingAngleChooserState',
	'src/states/wallBuilding/wallBuildingLengthChooserState',
	'src/states/wallBuilding/wallBuildingHeightChooserState',
	'src/states/wallBuilding/wallBuildingAppendAngleChooserState'
	], function(Wall,
				WallBuildingIdleState,
				WallBuildingAngleChooserState,
				WallBuildingLengthChooserState,
				WallBuildingHeightChooserState,
				WallBuildingAppendAngleChooserState) {

	var WallBuildingManager = function(addWallToTheModelCallback, getWallFromModelCallback, scene){

		var self = this;

		var _scene = scene;
		var _addWallToTheModelCallback = addWallToTheModelCallback;
		var _getWallFromTheModelCallback = getWallFromModelCallback;
		var _wallStartPoint_GroundSpace;
		var _wallDirection_GroundSpace;
		var _wall;
		var _currentState = null;

		self.handleMouseMove = function(event){
			_currentState.handleMouseMove(event);
		}

		self.handleMouseDown = function(event) {
			_currentState.handleMouseDown(event);
		}

		self.handleMouseUp = function(event) {
			_currentState.handleMouseUp(event);
		}

		self.decideWhatsNext = function(stateOutput) {

			if (_currentState == null){
				_currentState = new WallBuildingIdleState(null, _scene, self.decideWhatsNext);
				return;
			}

			if (_currentState.getClassname() == "WallBuildingIdleState") {
				var pickResult = stateOutput;
				var pickedMesh = pickResult.pickedMesh;
				var pickedPoint = pickResult.pickedPoint;

				if (pickedMesh.name == "ground") {
					_wallStartPoint_GroundSpace = new BABYLON.Vector2(pickedPoint.x, pickedPoint.z);
					_currentState = new WallBuildingAngleChooserState(pickedPoint, _scene, self.decideWhatsNext);
				} 
				else if (pickedMesh.name.startsWith("wall")) {
					let pickedWall = getWallFromModelCallback(pickedMesh.name.split("#")[1]);
					var pickedSideString = pickedWall.getPickedSide(pickedPoint);

					var nextStateInput = {
						wall: pickedWall,
						side: pickedSideString
					};

					_currentState = new WallBuildingAppendAngleChooserState(nextStateInput, _scene, self.decideWhatsNext);
				}
			} 
			else if (_currentState.getClassname() == "WallBuildingAngleChooserState"){

				_wallDirection_GroundSpace = stateOutput;

				var nextStateInput = { 
					wallDirection: _wallDirection_GroundSpace,
					wallStart: _wallStartPoint_GroundSpace
				}
				_currentState = new WallBuildingLengthChooserState(nextStateInput, _scene, self.decideWhatsNext);
			}
			else if (_currentState.getClassname() == "WallBuildingLengthChooserState"){

				_wall = stateOutput;
				_currentState = new WallBuildingHeightChooserState(_wall, _scene, self.decideWhatsNext);
			}
			else if (_currentState.getClassname() == "WallBuildingHeightChooserState"){

				_addWallToTheModelCallback(_wall);
				_currentState = new WallBuildingIdleState(null, _scene, self.decideWhatsNext);
			} 
			else if (_currentState.getClassname() == "WallBuildingAppendAngleChooserState"){

				var wallJoint = stateOutput;

				var nextStateInput = { 
					wallDirection: wallJoint.getNewWallDirecitonGroundSpace(),
					wallStart: wallJoint.getNewEndWallStartPointGroundSpace()
				}

				_currentState = new WallBuildingLengthChooserState(nextStateInput, _scene, self.decideWhatsNext);
			}
		}

		self.decideWhatsNext();
	}

	return WallBuildingManager;
});