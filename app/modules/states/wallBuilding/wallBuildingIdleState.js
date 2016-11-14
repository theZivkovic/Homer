define([], function(){

	var WallBuildingIdleState = function(input, scene, doneCallback){

		var self = this;

		self.handleMouseMove = function(event){
			
		}

		self.handleMouseDown = function(event) {
			var pickResult = scene.pick(scene.pointerX, scene.pointerY);
			if (pickResult != null)
				doneCallback(pickResult);
		}

		self.handleMouseUp = function(event) {
			
		}

		self.getClassname = function(){
			return "WallBuildingIdleState";
		}
	};

	return WallBuildingIdleState;
});