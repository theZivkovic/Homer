define([
	'src/states/wallBuilding/wallBuildingIdleState',
	'src/states/wallBuilding/wallBuildingAngleChooserState',
	'src/states/wallBuilding/wallBuildingLengthChooserState',
	'src/states/wallBuilding/wallBuildingHeightChooserState'
	], function(WallBuildingIdleState,
				WallBuildingAngleChooserState,
				WallBuildingLengthChooserState,
				WallBuildingHeightChooserState) {

	var WallBuildingManager = function(scene){

		var self = this;
		var _currentState = null;
		var _scene = scene;
		var _wallStartPoint_GroundSpace;
		var _wallDirection_GroundSpace;
		var _wall;

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

				_currentState = new WallBuildingIdleState(null, _scene, self.decideWhatsNext);
			}
		}

		self.decideWhatsNext();
	}

	return WallBuildingManager;
});