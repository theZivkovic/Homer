define(['src/model/fullAngleChooser'], function(FullAngleChooser){

	var WallBuildingAngleChooserState = function(input, scene, doneCallback){

		var self = this;
		var _mouseDownPoint_WorldSpace = input;
		console.log(input);
		var _fullAngleChooser = new FullAngleChooser(5.0, new BABYLON.Vector2(1,0), Math.PI, scene);
		_fullAngleChooser.setPosition(_mouseDownPoint_WorldSpace);

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
			doneCallback(_fullAngleChooser.getDirectionVectorGroundSpace());
		}

		self.getClassname = function(){
			return "WallBuildingAngleChooserState";
		}
	};

	return WallBuildingAngleChooserState;
});