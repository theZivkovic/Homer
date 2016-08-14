'use strict';

define([
	'src/model'
],

function(Model){

     var Starter = function(){

        var self = this;
        
        var _renderCanvas = null;
        var _engine = null;
        var _scene = null;
        var _camera = null;
        var _light = null;

        self.initEverything = function() {

        	_initEngine();
        	_initScene();
        	_initCamera();
        	_initLights();
        	_initRandomMeshes();
        	_initRuntime();

        	console.log(new Model());
        }

        var _initEngine  = function() {

        	_renderCanvas = document.querySelector("#renderCanvas");
        	_engine = new BABYLON.Engine(_renderCanvas, true);
        }

        var _initScene = function() {

        	_scene = new BABYLON.Scene(_engine);
        	_scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);
        }

        var _initCamera = function() {

        	_camera = new BABYLON.ArcRotateCamera('mainCamera', 1.0, 1.0, 12, BABYLON.Vector3.Zero(), _scene);
        	_camera.attachControl(_renderCanvas, false);
        }

        var _initLights = function() {

        	_light = new BABYLON.HemisphericLight('mainLight', new BABYLON.Vector3(0, 1, 0), _scene);
        	_light.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);

        }

        var _initRandomMeshes = function(){

        	var mesh = BABYLON.Mesh.CreateBox('sampleCube', 3, _scene);
        	mesh.material =  new BABYLON.StandardMaterial('sampleMaterial', _scene);
			mesh.material.diffuseColor = new BABYLON.Color3(0.5, 1.0, 0.5);
        }

        var _initRuntime = function() {

        	_engine.runRenderLoop(function(){
            	_scene.render();
        	});

	        window.addEventListener('resize', function(){
	            _engine.resize();
	        });
        }

    }

    return Starter;
});