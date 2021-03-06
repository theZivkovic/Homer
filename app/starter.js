'use strict';

define([
	'src/model/model',
    'src/managers/wallBuildingManager',
    'src/model/wall'
],

function(Model, WallBuildingManager, Wall){

     var Starter = function(){

        var self = this;
        
        var _renderCanvas = null;
        var _engine = null;
        var _scene = null;
        var _camera = null;
        var _light = null;
        var _ground = null;
        var _model = null;
        var _interactionStateManager = null;
        var _wallBuildingManager = null;

        self.initEverything = function() {

        	_initEngine();
        	_initScene();
        	_initCamera();
        	_initLights();
        	_initStaticMeshes();
        	_initRuntime();

            _wallBuildingManager = new WallBuildingManager(_model.addWall, _model.getWallByID, _scene);
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

        	_camera = new BABYLON.ArcRotateCamera("mainCamera", 1.0, 1.0, 54, BABYLON.Vector3.Zero(), _scene);
        	//_camera.attachControl(_renderCanvas, false);
        }

        var _initLights = function() {

            _light = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, -1, 0), _scene);
            _light.diffuse = new BABYLON.Color3(.5, .5, .5);
            _light.specular = new BABYLON.Color3(1, 1, 1);
        }

        var _initStaticMeshes = function(){

        	_ground = new BABYLON.Mesh.CreateGround("ground", 100, 100, 2, _scene);
        	_ground.material = new BABYLON.StandardMaterial('sampleMaterial', _scene);
			_ground.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            _ground.material.speculaColor = new BABYLON.Color3(0.7, 0.7, 0.7);

            _model = new Model();
            let wall = new Wall(new BABYLON.Vector2(0,0), new BABYLON.Vector2(0,1), 20, 5, 2.0, _scene);
            let wall1 = new Wall(new BABYLON.Vector2(0,0), new BABYLON.Vector2(1,1), 20, 5, 2.0, _scene);
            _model.addWall(wall);
            _model.addWall(wall1);
        }

        var _initRuntime = function() {

        	_engine.runRenderLoop(function(){
            	_scene.render();
        	});

	        window.addEventListener('resize', function(){
	            _engine.resize();
	        });

            window.addEventListener("mousedown", function(event){
                _wallBuildingManager.handleMouseDown(event);
            });

            window.addEventListener("mouseup", function(event){
                 _wallBuildingManager.handleMouseUp(event);
            });

            window.addEventListener("mousemove", function(event){
                 _wallBuildingManager.handleMouseMove(event);
            });
        }

    }

    return Starter;
});