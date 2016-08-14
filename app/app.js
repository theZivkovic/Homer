'use strict';

requirejs.config({

	baseUrl: '../',
	paths: {
		'src'		: '/app/modules',
		'starter'	: '/app/starter',
		'handful'	: '/node_modules/hand/hand',
		'babylon'	: '/lib/babylonjs/dist/babylon.2.4',
		'oimo'		: '/lib/babylonjs/dist/Oimo',
		'cannon'	: '/lib/babylonjs/dist/cannon',
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