'use strict';

define([
	'src/model/model',
    'src/states/interactionStateManager',
    'src/states/angleChoosingState',
    'src/states/lengthChoosingState'
],

function(Model, InteractionStateManager, AngleChoosingState, LengthChoosingState){

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
        //var _angleChoosingState = null;
        var _lengthChoosingState = null

        self.initEverything = function() {

        	_initEngine();
        	_initScene();
        	_initCamera();
        	_initLights();
        	_initStaticMeshes();
        	_initRuntime();

            _interactionStateManager = new InteractionStateManager();
            //_angleChoosingState = new AngleChoosingState(_scene);
            _lengthChoosingState = new LengthChoosingState(new BABYLON.Vector2(5, 5), new BABYLON.Vector2(1, 0), _scene);
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
            _model.addWall("Prvi", new BABYLON.Vector2(0, 0), new BABYLON.Vector2(1, 0), 9.0, 2.0, new BABYLON.Vector2(0, 1), new BABYLON.Vector2(0, 1), 1.0, 1.0, _scene);
            _model.addWall("Drugi", new BABYLON.Vector2(1, 1), new BABYLON.Vector2(0, 1), 5.0, 2.0, new BABYLON.Vector2(0, 1), new BABYLON.Vector2(0, 1), 1.0, 1.0, _scene);
            _model.addWall("Treci", new BABYLON.Vector2(-5,5), new BABYLON.Vector2(0, 1), 9.0, 2.0, new BABYLON.Vector2(1, 1), new BABYLON.Vector2(1, 1), 1.0, 1.0, _scene);
            _model.addWall("Cet", new BABYLON.Vector2(-10,5), new BABYLON.Vector2(0, 1), 9.0, 2.0, new BABYLON.Vector2(0, 1), new BABYLON.Vector2(1, 1), 1.0, 1.0, _scene);
            _model.addWall("Pet", new BABYLON.Vector2(-15,5), new BABYLON.Vector2(0, 1), 9.0, 4.0, new BABYLON.Vector2(1, 1), new BABYLON.Vector2(0, 1), 1.0, 1.0, _scene);

        }


        var _handleMouseDown = function(mouseDownPoint2D){
                //_angleChoosingState.handleCenterPicking(mouseDownPoint2D);
        }

        var _handleMouseUp = function(mouseDownPoint2D, mouseUpPoint2D){
                //_angleChoosingState.handleFinishChosing(mouseDownPoint2D, mouseUpPoint2D);
                _lengthChoosingState.handleFinishResizing(mouseUpPoint2D);
        }

        var _handleMouseMove = function(mouseMovePoint2D) {
             //_angleChoosingState.handleRadiusChange(mouseMovePoint2D);
             _lengthChoosingState.handleWallResizing(mouseMovePoint2D);
        }

        var _initRuntime = function() {

        	_engine.runRenderLoop(function(){
            	_scene.render();
        	});

	        window.addEventListener('resize', function(){
	            _engine.resize();
	        });

            window.addEventListener("mousedown", function(event){
                _interactionStateManager.handleMouseDown(event, _scene, _handleMouseDown);
            });

            window.addEventListener("mouseup", function(event){
                 _interactionStateManager.handleMouseUp(event, _scene, _handleMouseUp);
            });

            window.addEventListener("mousemove", function(event){
                 _interactionStateManager.handleMouseMove(event, _scene, _handleMouseMove);
            });
        }

    }

    return Starter;
});