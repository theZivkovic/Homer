define([], function(){

	var InteractionStateManager = function(){

		var self = this;
		var _mouseDownPoint = null;

		self.handleMouseDown = function(event, scene, mouseDownCallback){
			var pickResult = scene.pick(scene.pointerX, scene.pointerY);
			var pickedPoint = pickResult.pickedPoint;
			_mouseDownPoint = new BABYLON.Vector2(pickedPoint.x, pickedPoint.z);
			mouseDownCallback(_mouseDownPoint);
		}

		self.handleMouseUp = function(event, scene, mouseUpCallBack){
			var pickResult = scene.pick(scene.pointerX, scene.pointerY);
			var pickedPoint = pickResult.pickedPoint;
			var _mouseUpPoint = new BABYLON.Vector2(pickedPoint.x, pickedPoint.z);
			mouseUpCallBack(_mouseDownPoint, _mouseUpPoint);

			_mouseDownPoint = null;
			_mouseUpPoint = null;
		}

		self.handleMouseMove = function(event, scene, mouseMoveCallback){

			if (!_mouseDownPoint)
				return;
			
			var pickResult = scene.pick(scene.pointerX, scene.pointerY);
			var pickedPoint = pickResult.pickedPoint;
			var _mouseMovePoint = new BABYLON.Vector2(pickedPoint.x, pickedPoint.z);
			mouseMoveCallback(_mouseMovePoint);

		}
	}

	return InteractionStateManager;
});