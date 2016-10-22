define(['src/model/angleChooserMesh'], function(AngleChooserMesh){

	var AngleChoosingState = function(scene) {

		var self = this;
		var _scene = scene;
		var _angleChooserMesh = new AngleChooserMesh(5, _scene);
		_angleChooserMesh.showChooser(false);
		_angleChooserMesh.showText(false);

		self.handleCenterPicking = function(mouseDownPoint2D) {
			_angleChooserMesh.setPosition(new BABYLON.Vector3(mouseDownPoint2D.x, 0.0, mouseDownPoint2D.y));
			_angleChooserMesh.showChooser(true);
			_angleChooserMesh.showDirectionLine(false);
		}

		self.handleRadiusChange = function(mouseMovePoint2D) {
			var circlePoint = new BABYLON.Vector3(mouseMovePoint2D.x, 0.0, mouseMovePoint2D.y);
			_angleChooserMesh.setDirectionLine(circlePoint);
			_angleChooserMesh.showDirectionLine(true);
			_angleChooserMesh.showText(true);
		}

		self.handleFinishChosing = function(mouseDownPoint2D, mouseUpPoint2D) {
			_angleChooserMesh.showText(false);
		}
	}

	return AngleChoosingState;
}); 