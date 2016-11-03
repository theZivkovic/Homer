define([
	'src/model/fullAngleChooser',
	'src/model/wall'
	], function(FullAngleChooser, Wall){

	var WallBuildingManager = function(scene){

		var self = this;
		self._wallBegin_groundSpace = null;
		self._wallDirection_groundSpace = null;
		self._angleChooserDirection_groundSpace = null;
		self._wall = null;

		var _scene = scene;

		var _states = {

			IDLE_STATE: {

				enter: function() {
					
				},

				exit: function(){
					
				},

				handleMouseDown: function(event){
					var pickResult = _scene.pick(_scene.pointerX, _scene.pointerY);
					var pickedMesh = pickResult.pickedMesh;

					if (pickedMesh.name.startsWith("frontRibbon") || pickedMesh.name.startsWith("rearRibbon"))
					{
						var quadVertexBuffer = pickedMesh.geometry._vertexBuffers.position._buffer._data;
						var quadBottomCenter = new BABYLON.Vector2((quadVertexBuffer[0] + quadVertexBuffer[6]) / 2.0, (quadVertexBuffer[2] + quadVertexBuffer[8])/2.0);
						var quadLineDirection = new BABYLON.Vector2(quadVertexBuffer[6] - quadVertexBuffer[0], quadVertexBuffer[8] - quadVertexBuffer[2]);
						quadLineDirection.normalize();
						var quadLineNormalLeft = new BABYLON.Vector2(quadLineDirection.y, -quadLineDirection.x);

						self._wallBegin_groundSpace = quadBottomCenter;
						self._angleChooserDirection_groundSpace = quadLineNormalLeft;
						_changeState(_states.ANGLE_CHOOSING_STATE);	
					}
					else if (pickedMesh.name == "ground")
					{
						self._wallBegin_groundSpace = new BABYLON.Vector2(pickResult.pickedPoint.x, pickResult.pickedPoint.z);
						self._angleChooserDirection_groundSpace = new BABYLON.Vector2(1, 0);
						_changeState(_states.ANGLE_CHOOSING_STATE);	
					}
					else
					{
						console.log("SOMETHING ELSE...");
					}

				},

				handleMouseMove: function(event){

					
				},

				handleMouseUp: function(event){

				}
			},

			ANGLE_CHOOSING_STATE: {

				enter: function() {
					this._angleChooserMesh = new FullAngleChooser(5, self._angleChooserDirection_groundSpace, Math.PI, _scene);
					this._angleChooserMesh.showChooser(true);
					this._angleChooserMesh.showText(true);
					this._angleChooserMesh.setPosition(new BABYLON.Vector3(self._wallBegin_groundSpace.x, 0.0, self._wallBegin_groundSpace.y));
				},

				exit: function(){
					
				},

				handleMouseDown: function(event){
					// do nothinh
				},

				handleMouseMove: function(event){

					if (!self._wallBegin_groundSpace)
						return;

					var pickResult = _scene.pick(_scene.pointerX, _scene.pointerY);
					var pickedPoint = pickResult.pickedPoint;
					var pointOnCircle = pickedPoint;
					this._angleChooserMesh.setDirectionLine(pointOnCircle);
					this._angleChooserMesh.showDirectionLines(true);
					this._angleChooserMesh.showText(true);
				},

				handleMouseUp: function(event){

					this._angleChooserMesh.showText(false);
					this._angleChooserMesh.showChooser(false);
					this._angleChooserMesh.showDirectionLines(false);
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
					this._initialPointerY = _scene.pointerY;
				},

				exit: function(){

				},

				handleMouseDown: function(event){
					
				},

				handleMouseMove: function(event){

					var newWallHeight = (this._initialPointerY - _scene.pointerY) / 10.0;
					var clampedWallHeight = newWallHeight <= 0.1 ? 0.1 : newWallHeight > 10 ? 10 : newWallHeight;
					self._wall.changeWallHeight(clampedWallHeight);
				},

				handleMouseUp: function(event){
					
					_changeState(_states.IDLE_STATE);
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
		_changeState(_states.IDLE_STATE);
	}

	return WallBuildingManager;
});