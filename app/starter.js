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
        var _ground = null;

        self.initEverything = function() {

        	_initEngine();
        	_initScene();
        	_initCamera();
        	_initLights();
        	_initStaticMeshes();
        	_initRuntime();
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

        	_camera = new BABYLON.ArcRotateCamera("mainCamera", 1.0, 1.0, 12, BABYLON.Vector3.Zero(), _scene);
        	_camera.attachControl(_renderCanvas, false);
        }

        var _initLights = function() {

        	_light = new BABYLON.PointLight("mainLight", new BABYLON.Vector3(0, 5, 0), _scene);
			_light.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);
			_light.specular = new BABYLON.Color3(1, 1, 1);
        }

        var _initStaticMeshes = function(){

        	_ground = new BABYLON.Mesh.CreateGround("ground", 10, 10, 2, _scene);
        	_ground.material = new BABYLON.StandardMaterial('sampleMaterial', _scene);
			_ground.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
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