"use strict"

function init() {
	render_canvas.width = window.innerWidth;
	render_canvas.height = window.innerHeight;

	window.config = getConfig();
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

	function groundSetup(ground) {
	   var material = new BABYLON.StandardMaterial("std", window.scene);
	   material.diffuseTexture = new BABYLON.Texture("./assets/stone_wall.jpg", scene);
	   material.specularColor = new BABYLON.Color3(0, 0, 0);

	   ground.material = material;
	   ground.checkCollisions = true;
	   config.ground = ground;
	}

	BABYLON.Mesh.CreateGroundFromHeightMap("ground", "./assets/map_test.png", config.mapSize, config.mapSize, 200, config.y_min, config.y_max, window.scene, false, groundSetup);
}

function loadAssets(config) {
	var loader = new BABYLON.AssetsManager(window.scene);

	for(var i in config.meshesToLoad) {
		var task = loader.addMeshTask(i, '', config.meshesToLoad[i][0], config.meshesToLoad[i][1]);
		task.onSuccess = meshLoaded.bind(window, config);
		task.onError = function(err) { console.log(err)};
	}

	loader.onFinish = onAssetsLoaded.bind(window, config);
	loader.load(); // Démarre le chargement
}

function meshLoaded(config, task) {
	config.meshes[task.name] = task.loadedMeshes[0]; // one mesh per task !
	//task.loadedMeshes[0].isVisible = false;
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

	render_canvas.addEventListener("click", config.player.bindedFire);
	
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
