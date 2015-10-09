"use strict"

function init() {
	render_canvas.width = window.innerWidth;
	render_canvas.height = window.innerHeight;

	var config = getConfig();
	config.meshes = {};

	createScene(config);

	loadAssets(config);
}

function createScene(config) {
	window.engine = new BABYLON.Engine(render_canvas, true);
	window.scene = new BABYLON.Scene(window.engine);
	config.light = new BABYLON.HemisphericLight("hemi",new BABYLON.Vector3(0, 1, 0), window.scene);

	window.scene.clearColor = new BABYLON.Color3(0,0,0.2);
	config.light.groundColor = new BABYLON.Color3(0.5,0.5,0.5);

	var material = new BABYLON.StandardMaterial("std", window.scene);
	material.diffuseColor = new BABYLON.Color3(64/255, 66/255, 66/255);
	config.ground = BABYLON.Mesh.CreatePlane("plane", 200, window.scene);
	config.ground.material = material;
	config.ground.rotation.x = Math.PI /2;
	config.ground.checkCollisions = true;
}

function loadAssets(config) {
	var loader = new BABYLON.AssetsManager(window.scene);

	for(var i in config.meshesToLoad) {
		var task = loader.addMeshTask(i, '', '', config.meshesToLoad[i]);
		task.onSuccess = meshLoaded.bind(window, config);
	}

	loader.onFinish = onAssetsLoaded.bind(window, config);
	loader.load(); // Démarre le chargement
}

function meshLoaded(config, task) {
	config.meshes[task.name] = task.loadedMeshes[0]; // one mesh per task !
	task.loadedMeshes[0].isVisible = false;
}

function pointerLock() {
	render_canvas.addEventListener("click", function(evt) {
	    render_canvas.requestPointerLock = render_canvas.requestPointerLock || render_canvas.msRequestPointerLock || render_canvas.mozRequestPointerLock || render_canvas.webkitRequestPointerLock;
	    if (render_canvas.requestPointerLock) {
	        render_canvas.requestPointerLock();
	    }
	}, false);
}

function onAssetsLoaded(config) {

	config.player = new Player(config);
	
	pointerLock();

	window.onkeydown = function (evt) {
		config.player.onKeyDown(evt.keyCode);
	}

	window.onkeyup = function (evt) {
		config.player.onKeyUp(evt.keyCode);
	}

	function renderLoop () {

		update(config);
		draw();
	}

	window.engine.runRenderLoop(renderLoop);
}

