'use strict';

requirejs.config({

	baseUrl: '../',
	paths: {
		'src'		: '/app/modules',
		'starter'	: '/app/starter',
		'handful'	: '/node_modules/hand/hand',
		'babylon'	: '/lib/babylonjs/dist/preview release/babylon',
		'oimo'		: '/lib/babylonjs/dist/preview release/Oimo',
		'cannon'	: '/lib/babylonjs/dist/preview release/cannon',
	},
	shim: {
		'cannon'	: ['handful'],
		'oimo'		: ['cannon'],
		'babylon'	: ['oimo'],
		'starter'	: ['babylon']
	}
});

requirejs(['starter'], function(Starter){

	var starter = new Starter();
	starter.initEverything();

});