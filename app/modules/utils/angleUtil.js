define([], function(){

	var AngleUtil = function() {

		this.convertRadsToDegs = function(rads) {
			return rads * 180 / Math.PI;
		}

		this.convertDegsToRads = function(degs){
			return degs * Math.PI / 180;
		}

		this.convertRadiansToDirectionVector2D = function(angle_rad){
			return new BABYLON.Vector2(Math.cos(angle_rad), Math.sin(angle_rad));
		}

		this.convertDirectionVector2DToRadians = function(directionVector){
			return Math.atan2(directionVector.y, directionVector.x);
		}
	}

	return new AngleUtil();
});