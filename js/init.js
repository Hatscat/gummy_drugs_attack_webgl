"use strict"
window.onload = init;

function init () {
	render_canvas.width = window.innerWidth;
	render_canvas.height = window.innerHeight;

	window.config = getConfig();
	config.meshes = {};

	createScene(config);
	loadAssets(config);
}

function createScene (config) {
	window.engine = new BABYLON.Engine(render_canvas, true);
	window.scene = new BABYLON.Scene(window.engine);
	var map_side_size = config.cube_size * (Math.pow(2,config.map_side_n) + 1);
	config.light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(-map_side_size >> 1, map_side_size << 1, map_side_size >> 1), window.scene);

	window.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
	window.scene.fogDensity = 0.02;
	window.scene.clearColor = new BABYLON.Color3(1, 0.5, 0);
	window.scene.fogColor = new BABYLON.Color3(1, 0.5, 0);
	config.light.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);
}

function loadAssets (config) {
	var loader = new BABYLON.AssetsManager(window.scene);

	for(var i in config.meshesToLoad) {
		var task = loader.addMeshTask(i, '', config.meshesToLoad[i][0], config.meshesToLoad[i][1]);
		task.onSuccess = meshLoaded.bind(window, config);
		task.onError = function(err) { console.log(err)};
	}

	loader.onFinish = onAssetsLoaded.bind(window, config);
	loader.load(); // Démarre le chargement
}

function meshLoaded (config, task) {
	config.meshes[task.name] = task.loadedMeshes[0]; // one mesh per task !
}

function onAssetsLoaded (config) {
	config.map = new Map(config);
	config.player = new Player(config);

	init_events(config);

	function renderLoop () {
		update(config);
		draw();
	}
	window.engine.runRenderLoop(renderLoop);
}

