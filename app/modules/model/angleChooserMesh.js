define([], function(){

	var AngleChooserMesh = function(radius, scene){

		var CIRCLE_POINTS = 180;
		var MEASUREMENT_POINTS = 36;


		var self = this;

		var _angle = 0;

		var _radius = radius;
		var _scene = scene;
		var _position = new BABYLON.Vector3(0.0, 0.0, 0.0);

		var _circlePoints = new Array(CIRCLE_POINTS * 2);
		var _circle = null;
		var _lines = new Array(MEASUREMENT_POINTS);
		var _directionLine = null;
		var _crossLineX = null;
		var _crossLineY = null;

		var _outputPlane = null;
		var _outputPlaneTexture = null;

		var _init = function(){
			
			_createTextPlane();

		}

		var _createTextPlane = function(){

			_outputPlane = BABYLON.Mesh.CreatePlane("outputplane", 10, _scene, false, _outputPlane);
			_outputPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
			_outputPlane.material = new BABYLON.StandardMaterial("outputplane", _scene);
			_outputPlane.isPickable = false;
			
			_outputPlane.scaling.y = 0.5;

			_outputPlaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, _scene, true, _outputPlaneTexture);
			_outputPlane.material.diffuseTexture = _outputPlaneTexture;
			_outputPlane.material.specularColor = new BABYLON.Color3(0, 0, 0);
			_outputPlane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
			_outputPlane.material.alpha = 0.5;
			_outputPlane.material.backFaceCulling = false;
	
		}

		var _updateAngleText = function() {
			_outputPlane.position = _position.add(new BABYLON.Vector3(0, 5, 0));
			_outputPlaneTexture.getContext().clearRect(0, 0, 512, 512);
			_outputPlaneTexture.drawText(_angle.toFixed(0) + "", null, 256, "bold 140px verdana", "white", "#000");
		}

		var _updateCircle = function() {
			_updateInnerCircle();
			_updateOuterCircle();
			_circle = new BABYLON.Mesh.CreateLines("circle", _circlePoints, _scene, true, _circle);
		}

		var _updateInnerCircle = function(){

			for (var i = 0; i < CIRCLE_POINTS; i++){
			var angle = i * 2 * Math.PI / CIRCLE_POINTS;
			_circlePoints[i] = new BABYLON.Vector3(_position.x + _radius * Math.cos(angle),
												   _position.y + 0.0,
												   _position.z + _radius * Math.sin(angle));
			}
		}

		var _updateOuterCircle = function(){

			for (var i = CIRCLE_POINTS; i < 2 * CIRCLE_POINTS; i++){
				var angle = (i - CIRCLE_POINTS) * 2 * Math.PI / CIRCLE_POINTS;
				_circlePoints[i] = new BABYLON.Vector3(_position.x + (_radius * 1.1) * Math.cos(angle),
													   _position.y + 0.0,
													   _position.z + (_radius * 1.1) * Math.sin(angle));	
			}
		}

		var _updateMeasurementLines = function(){

			for (var i = 0; i < MEASUREMENT_POINTS; i++)
			{
				var measureAngleDeg = 360 / MEASUREMENT_POINTS;

				var angle = i * measureAngleDeg * Math.PI / 180;
				var innerPoint = new BABYLON.Vector3(_position.x + _radius * Math.cos(angle),
											 		 _position.y + 0.0,
											 		 _position.z + _radius * Math.sin(angle));

				var outerPoint = new BABYLON.Vector3(_position.x + (_radius * 1.1) * Math.cos(angle),
											 		  _position.y + 0.0,
											 		  _position.z + (_radius * 1.1) * Math.sin(angle));

				_lines[i] = new BABYLON.Mesh.CreateLines("line", [innerPoint, outerPoint], _scene, true, _lines[i]);
			}
		}

		var _updateCross = function(){

			_crossLineX = new BABYLON.Mesh.CreateLines("crossLineX", 
													   [_position.add(new BABYLON.Vector3(_radius / 10, 0.0, 0.0)),
													    _position.add(new BABYLON.Vector3(-_radius / 10, 0.0, 0.0))], _scene, true, _crossLineX);
			_crossLineY = new BABYLON.Mesh.CreateLines("_crossLineY",
													   [_position.add(new BABYLON.Vector3(0.0, 0.0, _radius / 10)),
													    _position.add(new BABYLON.Vector3(0.0, 0.0, -_radius / 10))], _scene, true, _crossLineY);
		}

		var _update = function(){

			_updateCircle();
			_updateMeasurementLines();
			_updateCross();
			_updateAngleText();
		}

		// =============== PUBLIC INTERFACE ==============================

		self.setRadius = function(newRadius){

			_radius = newRadius;
			_update();
		}

		self.setPosition = function(newPosition){
			_position = newPosition;
			_update();
		}

		self.setDirectionLine = function(directionPoint){

			// get begin and end points
			var beginPoint = _position;
			var endPoint = directionPoint;

			// calculate direction vector
			var directionVector = directionPoint.subtract(beginPoint);
			directionVector.normalize();
			
			// calculate angle that direction vector makes with X axis
			var angleRad = Math.atan2(directionVector.z, directionVector.x);
			if (angleRad < 0) angleRad += 2 * Math.PI;
			if (angleRad >= 2 * Math.PI) angleRad -= 2 * MAth.PI;
			
			// round the angle to the nearest measurement point
			var meauseAngle = 2 * Math.PI / MEASUREMENT_POINTS;
			var numberOfMeasuresInAngle = angleRad / meauseAngle;
			var decimalPart = numberOfMeasuresInAngle % 1;
			var angleDegRounded;
			if (decimalPart >= 0.5)
				angleRadRounded = Math.ceil(numberOfMeasuresInAngle) * meauseAngle;
			else
				angleRadRounded = Math.floor(numberOfMeasuresInAngle) * meauseAngle;

			// recalculate direction vector
			directionVector = new BABYLON.Vector3(Math.cos(angleRadRounded), 0.0, Math.sin(angleRadRounded));

			// calculate new direction point
			var newEndPoint = beginPoint.add(directionVector.scale(_radius * 1.1));

			// turn angles into degress
			_angle = angleRadRounded * 180 / Math.PI;

			// update/create direction line
			_directionLine = new BABYLON.Mesh.CreateLines("dirLine", [beginPoint, newEndPoint], _scene, true, _directionLine);
			_updateAngleText();
		}

		self.getPosition = function(){
			return _position;
		}

		self.showDirectionLine = function(show){
			if (_directionLine)
				_directionLine.visibility = show;
		}

		self.showChooser = function(show){
			_circle.visibility = show;
			_crossLineX.visibility = show;
			_crossLineY.visibility = show;
			_lines.forEach(function(line){
				line.visibility = show;
			});

		}

		self.showText = function(show){
			_outputPlane.visibility = show;
		}

		_init();
		_update();
	}



	return AngleChooserMesh;
});