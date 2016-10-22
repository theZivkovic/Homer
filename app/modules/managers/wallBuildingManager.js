define([
	'src/model/AngleChooserMesh',
	'src/model/wall'
	], function(AngleChooserMesh, Wall){

	var WallBuildingManager = function(scene){

		var self = this;
		self._wallBegin_groundSpace = null;
		self._wallDirection_groundSpace = null;
		self._wall = null;

		var _scene = scene;

		var _states = {

			ANGLE_CHOOSING_STATE: {

				enter: function() {
					this._angleChooserMesh = new AngleChooserMesh(5, _scene);
					this._angleChooserMesh.showChooser(false);
					this._angleChooserMesh.showText(false);
					this._mouseDownPoint_groundSpace = null;
				},

				exit: function(){
					this._mouseDownPoint_groundSpace = null;
				},

				handleMouseDown: function(event){
					var pickResult = _scene.pick(_scene.pointerX, _scene.pointerY);
					var pickedPoint = pickResult.pickedPoint;
					this._mouseDownPoint_groundSpace = new BABYLON.Vector2(pickedPoint.x, pickedPoint.z);
					this._angleChooserMesh.setPosition(pickedPoint);
					this._angleChooserMesh.showChooser(true);
					this._angleChooserMesh.showDirectionLine(false);
				},

				handleMouseMove: function(event){

					if (!this._mouseDownPoint_groundSpace)
						return;

					var pickResult = _scene.pick(_scene.pointerX, _scene.pointerY);
					var pickedPoint = pickResult.pickedPoint;
					var pointOnCircle = pickedPoint;
					this._angleChooserMesh.setDirectionLine(pointOnCircle);
					this._angleChooserMesh.showDirectionLine(true);
					this._angleChooserMesh.showText(true);
				},

				handleMouseUp: function(event){

					this._angleChooserMesh.showText(false);
					self._wallBegin_groundSpace = this._angleChooserMesh.getPositionGroundSpace();
					self._wallDirection_groundSpace  = this._angleChooserMesh.getDirectionVectorGroundSpace();
					_changeState(_states.LENGTH_CHOOSING_STATE);
				}
			},

			LENGTH_CHOOSING_STATE: {

				enter: function() {
					self._wall = new Wall("aaa", self._wallBegin_groundSpace, self._wallDirection_groundSpace, 5, 2, new BABYLON.Vector2(0, 1), new BABYLON.Vector2(0, 1), 1, 1, _scene);
				},

				exit: function(){

				},

				handleMouseDown: function(event){
					// do nothing
				},

				handleMouseMove: function(event){

					var pickResult = _scene.pick(_scene.pointerX, _scene.pointerY);
					var pickedPoint = pickResult.pickedPoint;
					var pickedPoint_groundSpace = new BABYLON.Vector2(pickedPoint.x, pickedPoint.z);

					var toMovePointVector = pickedPoint_groundSpace.subtract(self._wallBegin_groundSpace);
					var wallLength = BABYLON.Vector2.Dot(self._wallDirection_groundSpace, toMovePointVector) / self._wallDirection_groundSpace.length();

					if (wallLength < 0)
						wallLength = 0.0;

					self._wall.changeWallLength(wallLength);
				},

				handleMouseUp: function(event){
					_changeState(_states.HEIGHT_CHOOSING_STATE);
				}
			},

			HEIGHT_CHOOSING_STATE: {

				enter: function() {
					
				},

				exit: function(){

				},

				handleMouseDown: function(event){
					
				},

				handleMouseMove: function(event){

					var pickResult = _scene.pick(_scene.pointerX, _scene.pointerY);
					var newWallHeight = -(_scene.pointerY - window.innerHeight / 2.0) / 5.0;
					var clampedWallHeight = newWallHeight <= 0.1 ? 0.1 : newWallHeight > 10 ? 10 : newWallHeight;
					self._wall.changeWallHeight(clampedWallHeight);
					console.log(clampedWallHeight);
				},

				handleMouseUp: function(event){
					
					_changeState(_states.ANGLE_CHOOSING_STATE);
				}
			}
		}

		function _changeState(newState) {

			if (newState != _currentState) {
				if (_currentState)
					_currentState.exit();

				_currentState = newState;
				_currentState.enter();
			}

		}

		self.enter = function(){
			_currentState.enter();
		}

		self.exit = function(){
			_currentState.exit();
		}

		self.handleMouseMove = function(event){
			_currentState.handleMouseMove(event);
		}

		self.handleMouseDown = function(event){
			_currentState.handleMouseDown(event);
		}

		self.handleMouseUp = function(event){
			_currentState.handleMouseUp(event);
		}

		var _currentState = null;
		_changeState(_states.ANGLE_CHOOSING_STATE);
	}

	return WallBuildingManager;
});