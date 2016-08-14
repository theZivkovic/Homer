define([], function(){

	var Wall = function(startPoint2D, direction2D, wallLength, wallHeight, startNormalToDirection, endNormalToDirection, thicknessLeft, thicknessRight) {

		var self = this;

		var _startPoint2D = startPoint2D;
		var _direction2D = direction2D;
		var _wallLength = wallLength;
		var _wallHeight = wallHeight;
		var _startNormalToDirection = startNormalToDirection;
		var _endNormalToDirection = endNormalToDirection;
		var _thicknessLeft = thicknessLeft;
		var _thicknessRight = thicknessRight;
		
		var _quads = [];
		var _quadTopModified = false;
		var _quadBottomModified = false;
		var _quadLeftModified = false;
		var _quadRightModified = false;
		var _quadFrontModified = false;
		var _quadBackModified = false;

		self.updateQuads = function(){

			if (_quadTopModified)
				self.updateTopQuad();
			if (_quadBottomModified)
				self.updateBottomQuad();
			if (_quadLeftModified)
				self.updateLeftQuad();
			if (_quadRightModified)
				self.updateRightQuad();
			if (_quadFrontModified)
				self.updateFrontQuad();
			if (_quadBackModified)
				self.updateBackQuad();
		}

		self.updateTopQuad = function(){

		}

		self.updateBottomQuad = function(){

		}

		self.updateLeftQuad = function(){

		}

		self.updateRightQuad = function(){

		}

		self.updateFrontQuad = function(){

		}

		self.updateBackQuad = function(){

		}
	}

	return Wall;
});