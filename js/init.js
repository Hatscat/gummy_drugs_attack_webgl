"use strict"

function init() {
	render_canvas.width = window.innerWidth;
	render_canvas.height = window.innerHeight;

	var config = getConfig();

	createScene(config);

	config.player = new Player(config.keyBindings);

	loadAssets(config.meshes);

	pointerLock();
}

function createScene(config) {
	window.engine = new BABYLON.Engine(render_canvas, true);
	window.scene = new BABYLON.Scene(window.engine);
	config.light = new BABYLON.HemisphericLight("hemi",new BABYLON.Vector3(0, 1, 0), window.scene);
	//config.camera = new BABYLON.ArcRotateCamera("Camera", 1.0, 1.0, 12, BABYLON.Vector3.Zero(), window.scene);
	//config.camera.attachControl(render_canvas, false);

	window.scene.clearColor = new BABYLON.Color3(0,0,0.2);
	config.light.groundColor = new BABYLON.Color3(0.5, 0, 0.5);

	var material = new BABYLON.StandardMaterial("std", window.scene);
	material.diffuseColor = new BABYLON.Color3(64/255, 66/255, 66/255);
	var plan = BABYLON.Mesh.CreatePlane("plane", 100.0, window.scene);
	plan.material = material;
	plan.rotation.x = Math.PI /2;
	plan.checkCollisions = true;
}

function loadAssets(meshesList) {
	var loader = new BABYLON.AssetsManager(window.scene);

	for(var i in meshesList) {
		var task = loader.addMeshTask('mesh', '', '', meshesList[i]);
		task.onSuccess = meshLoaded;
	}

	loader.onFinish = function (tasks) {
		window.engine.runRenderLoop(render);
	};

	loader.load(); // Démarre le chargement
}

function meshLoaded(task) {
	for(var i in task.loadedMeshes) {
		task.loadedMeshes[i].isVisible = false;
	}
}

function pointerLock() {
	render_canvas.addEventListener("click", function(evt) {
	    render_canvas.requestPointerLock = render_canvas.requestPointerLock || render_canvas.msRequestPointerLock || render_canvas.mozRequestPointerLock || render_canvas.webkitRequestPointerLock;
	    if (render_canvas.requestPointerLock) {
	        render_canvas.requestPointerLock();
	    }
	}, false);
}
