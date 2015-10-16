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

	window.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR; //BABYLON.Scene.FOGMODE_EXP //
	//window.scene.fogDensity = 0.03;
	window.scene.fogStart = config.fog_start;
	window.scene.fogEnd = config.fog_end;
	window.scene.clearColor = new BABYLON.Color3(1, 0, 0);
	window.scene.fogColor = config.is_dev_mode ? new BABYLON.Color3(0, 1, 0) : new BABYLON.Color3(1, 0, 0);
	config.light.groundColor = new BABYLON.Color3(1, 0, 0);
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
	
	// TMP:
		console.log(config.meshes)
		config.meshes.enemy.position.x = 1
		config.meshes.enemy.position.z = 1
		config.meshes.enemy.position.y = config.map.get_raw_y(config.map.get_index_from_xz(config.meshes.enemy.position.x, config.meshes.enemy.position.z))
		config.meshes.enemy.scaling.x = config.meshes.enemy.scaling.z = config.meshes.enemy.scaling.y = 0.5

	init_events(config);

	initUI();

	function renderLoop () {
		update(config);
		draw();
	}
	window.engine.runRenderLoop(renderLoop);
}

