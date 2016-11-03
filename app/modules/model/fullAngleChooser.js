define(['src/utils/angleUtil'], function(AngleUtil){

	var FullAngleChooser = function(radius, xAxisDirection_groundSpace, angleOffset_rad, scene){
		
		var CIRCLE_DELTA_ANGLE_RAD = Math.PI / 90.0;
		var MEAUREMENTS_DELTA_ANGLE_RAD = Math.PI / 6;
		var OUTER_INNER_RADIUS_RADIO = 1.1;

		var _xAxisDirection_groundSpace = xAxisDirection_groundSpace; 
		var _center_worldSpace = new BABYLON.Vector3(0.0, 0.0, 0.0);
		var _radius = radius;
		var _scene = scene;
		var _angleOffset_rad = angleOffset_rad;
		var _angleToDisplay = 0.0;

		var _innerCircle = null;
		var _outerCircle = null;
		var _directionLine = null;
		var _measurementLines = [];
		var _outputPlane = null;
		var _outputPlaneTexture = null;
		var _xAxisLine = null;

		function _init() {
			_xAxisDirection_groundSpace.normalize();
			_measurementLines = new Array(Math.floor(2 * angleOffset_rad / MEAUREMENTS_DELTA_ANGLE_RAD));
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

		function _update() {
			_updateCircles();
		}

		function _updateCircles() {
			_updateXAxisLine();
			_updateInnerCircle();
			_updateOuterCircle();
			_updateMeasurementLines();
			_updateAngleText();
		}

		function _updateXAxisLine(){

			var beginPoint = _center_worldSpace;
			var xAxisDirection_worldSpace = new BABYLON.Vector3(_xAxisDirection_groundSpace.x, 0.0, _xAxisDirection_groundSpace.y);
			var endPoint = beginPoint.add(xAxisDirection_worldSpace.scale(_radius));

			_xAxisLine = new BABYLON.Mesh.CreateLines("line", [beginPoint, endPoint], _scene, true, _xAxisLine);
			_xAxisLine.material = new BABYLON.StandardMaterial("gray", _scene);
			_xAxisLine.material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
		}

		function _updateInnerCircle() {
			var innerCirclePoints = _calculateCirclePoints(_radius);
			_innerCircle = new BABYLON.Mesh.CreateLines("innerCircle", innerCirclePoints, _scene, true, _innerCircle);
		}

		function _updateOuterCircle() {
			var outerCirclePoints = _calculateCirclePoints(_radius * OUTER_INNER_RADIUS_RADIO);
			_outerCircle = new BABYLON.Mesh.CreateLines("innerCircle", outerCirclePoints, _scene, true, _outerCircle);
		}

		function _calculateCirclePoints(customRadius) {
			
			var circlePoints = [];
			var xAxisAngle_rad = AngleUtil.convertDirectionVector2DToRadians(_xAxisDirection_groundSpace);
			var startAngle_rad = _getStartAngleRad();
			var endAngle_rad = _getEndAngleRad();

			var lineBeginPoint = new BABYLON.Vector3(_center_worldSpace.x + Math.cos(startAngle_rad) * customRadius,
													 _center_worldSpace.y,
													 _center_worldSpace.z + Math.sin(startAngle_rad) * customRadius);

			circlePoints.push(lineBeginPoint);

			for (var angle_rad = startAngle_rad + CIRCLE_DELTA_ANGLE_RAD; 
					 angle_rad <= endAngle_rad;
					 angle_rad += CIRCLE_DELTA_ANGLE_RAD) {

				var nextPoint = new BABYLON.Vector3(_center_worldSpace.x + Math.cos(angle_rad) * customRadius,
													_center_worldSpace.y,
													_center_worldSpace.z + Math.sin(angle_rad) * customRadius);
				circlePoints.push(nextPoint);
			}

			var lastPoint = new BABYLON.Vector3(_center_worldSpace.x + Math.cos(endAngle_rad) * customRadius,
												_center_worldSpace.y,
												_center_worldSpace.z + Math.sin(endAngle_rad) * customRadius);
			circlePoints.push(lastPoint);

			return circlePoints;	
		}

		function _getStartAngleRad(){
			var xAxisAngle_rad = AngleUtil.convertDirectionVector2DToRadians(_xAxisDirection_groundSpace);
			var startAngle_rad = xAxisAngle_rad - _angleOffset_rad;
			return startAngle_rad;
		}

		function _getEndAngleRad(){
			var xAxisAngle_rad = AngleUtil.convertDirectionVector2DToRadians(_xAxisDirection_groundSpace);
			var endAngle_rad = xAxisAngle_rad + _angleOffset_rad;
			return endAngle_rad;
		}

		function _getEndingAngleOffsetRad(){
			var endingAngleOffset_rad = (_angleOffset_rad - Math.floor(_angleOffset_rad / MEAUREMENTS_DELTA_ANGLE_RAD) * MEAUREMENTS_DELTA_ANGLE_RAD);
			return endingAngleOffset_rad;
		}

		function _updateMeasurementLines() {

			var xAxisAngle_rad = Math.atan2(_xAxisDirection_groundSpace.y, _xAxisDirection_groundSpace.x);
			var startAngle_rad = _getStartAngleRad();
			var endAngle_rad = _getEndAngleRad();
			var endingAngleOffset_rad = _getEndingAngleOffsetRad();
			
			var addMeasurementLine = function(lineIndex, measurementLineAngle){
				var innerPoint = new BABYLON.Vector3(_center_worldSpace.x + Math.cos(measurementLineAngle) * _radius,
													_center_worldSpace.y,
													_center_worldSpace.z + Math.sin(measurementLineAngle) * _radius);

				var outerPoint = new BABYLON.Vector3(_center_worldSpace.x + Math.cos(measurementLineAngle) * _radius * OUTER_INNER_RADIUS_RADIO,
													_center_worldSpace.y,
													_center_worldSpace.z + Math.sin(measurementLineAngle) * _radius * OUTER_INNER_RADIUS_RADIO);
				_measurementLines[lineIndex] = new BABYLON.Mesh.CreateLines("line", [innerPoint, outerPoint], _scene, true, _measurementLines[lineIndex]);
			}

			var lineCounter = 0;
			addMeasurementLine(lineCounter, startAngle_rad);
			lineCounter++;

			for (var angle_rad = startAngle_rad + endingAngleOffset_rad; 
					 angle_rad <= endAngle_rad - endingAngleOffset_rad;
					 angle_rad += MEAUREMENTS_DELTA_ANGLE_RAD) {

				addMeasurementLine(lineCounter, angle_rad);
				lineCounter++;
			}

			addMeasurementLine(lineCounter, endAngle_rad);
		}

		var _updateAngleText = function() {
			_outputPlane.position = _center_worldSpace.add(new BABYLON.Vector3(0, 5, 0));
			_outputPlaneTexture.getContext().clearRect(0, 0, 512, 512);
			_outputPlaneTexture.drawText((_angleToDisplay > 0 ? "+" : "") +
										  _angleToDisplay.toFixed(0) + "", null, 256, "bold 140px verdana", "white", "#000");
		}

		_init();
		_update();

		this.getPositionGroundSpace = function(){
			return new BABYLON.Vector2(_center_worldSpace.x, _center_worldSpace.z);
		}

		this.getDirectionVectorGroundSpace = function(){
			return new BABYLON.Vector2(_directionVector.x, _directionVector.z);
		}

		this.setRadius = function(newRadius){
			_radius = newRadius;
			_update();
		}

		this.setPosition = function(newPosition){
			_center_worldSpace = newPosition;
			_update();
		}

		this.setDirectionLine = function(directionPoint_worldSpace){

			var beginPoint = _center_worldSpace;
			var endPoint = directionPoint_worldSpace;
			var directionVector_worldSpace = endPoint.subtract(beginPoint);
			directionVector_worldSpace.normalize();
			var directionVector_groundSpace = new BABYLON.Vector2(directionVector_worldSpace.x, directionVector_worldSpace.z);

			var angleWithXAxis_rad = Math.acos(BABYLON.Vector2.Dot(_xAxisDirection_groundSpace, directionVector_groundSpace));

			var directionVectorAngle_rad = AngleUtil.convertDirectionVector2DToRadians(directionVector_groundSpace);
			var xAxisAngle_rad = AngleUtil.convertDirectionVector2DToRadians(_xAxisDirection_groundSpace);
			var startAngle_rad = _getStartAngleRad();
			var endAngle_rad = _getEndAngleRad();
			var endingOffset_rad = _getEndingAngleOffsetRad();
			
			var numOfDeltaAngles = (directionVectorAngle_rad - (startAngle_rad + endingOffset_rad)) / MEAUREMENTS_DELTA_ANGLE_RAD;
			var numOfDeltaAnglesDecimalPart = numOfDeltaAngles % 1;
			var newDirectionAngle_rad = 0;
			if (numOfDeltaAnglesDecimalPart > 0.5)
				newDirectionAngle_rad = startAngle_rad + endingOffset_rad + Math.ceil(numOfDeltaAngles) * MEAUREMENTS_DELTA_ANGLE_RAD;
			else
				newDirectionAngle_rad = startAngle_rad + endingOffset_rad + Math.floor(numOfDeltaAngles) * MEAUREMENTS_DELTA_ANGLE_RAD;

			if (newDirectionAngle_rad > endAngle_rad)
				newDirectionAngle_rad = endAngle_rad;
			if (newDirectionAngle_rad < startAngle_rad)
				newDirectionAngle_rad = startAngle_rad;

			_directionVector = new BABYLON.Vector3(Math.cos(newDirectionAngle_rad), 0.0, Math.sin(newDirectionAngle_rad));
			_directionVector.normalize();

			var clampedEndPoint = beginPoint.add(_directionVector.scale(_radius));
			_directionLine = new BABYLON.Mesh.CreateLines("dirLine", [beginPoint, clampedEndPoint], _scene, true, _directionLine);
			_angleToDisplay = (newDirectionAngle_rad - xAxisAngle_rad) * 180 / Math.PI;
			_updateAngleText();
		}

		this.showChooser = function(show){
			_innerCircle.visibility = show;
			_outerCircle.visibility = show;
			_measurementLines.forEach(function(line){
				line.visibility = show;
			});
		}

		this.showDirectionLines = function(show){
			_directionLine.visibility = show;
			_xAxisLine.visibility = show;
		}

		this.showText = function(show){
			_outputPlane.visibility = show;
		}
		
	}

	return FullAngleChooser;
});