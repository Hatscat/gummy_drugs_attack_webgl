"use strict"
window.onload = init;

function init () {
	render_canvas.width = window.innerWidth;
	render_canvas.height = window.innerHeight;

	window.config = getConfig();

	createScene(config);
	loadAssets(config);
}

function createScene (config) {
	window.engine = new BABYLON.Engine(render_canvas, true);
	window.scene = new BABYLON.Scene(window.engine);
	var map_side_size = config.cube_size * (Math.pow(2,config.map_side_n) + 1);
	config.light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(-map_side_size >> 1, map_side_size << 1, map_side_size >> 1), window.scene);

	window.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
	//window.scene.fogDensity = 0.03;
	window.scene.fogStart = config.fog_start;
	window.scene.fogEnd = config.fog_end;
	window.scene.clearColor = config.light_color;
	window.scene.fogColor = config.is_dev_mode ? new BABYLON.Color3(0, 1, 0) : config.light_color;
	config.light.groundColor = config.light_color;
}

function loadAssets (config) {
	var loader = new BABYLON.AssetsManager(window.scene);

	var meshLoadedBinded =  meshLoaded.bind(window, config);
	var imgLoadBinded =  imgLoaded.bind(window, config);

	for(var i in config.meshesToLoad) {
		var task = loader.addMeshTask(i, '', config.meshesToLoad[i][0], config.meshesToLoad[i][1]);
		task.onSuccess = meshLoadedBinded;
		task.onError = loadError;
	}
	for(var i in config.imgToLoad) {
		var img = loader.addImageTask(i, config.imgToLoad[i]);
		img.onSuccess = imgLoadBinded;
		img.onError = loadError;
	}

	loader.onFinish = onAssetsLoaded.bind(window, config);
	loader.load(); // Démarre le chargement
}

function loadError(err) {
	console.error(err)
}

function meshLoaded (config, task) {
	config.meshes[task.name] = task.loadedMeshes[0]; // one mesh per task ! currently we have no multimesh
}

function imgLoaded(config, task) {
	config.imgs[task.name] = task.image;
}

function onAssetsLoaded (config) {
	config.meshes.enemy.isVisible = false;

	initUI(config);
	drawTitleScreen(config.imgs.title);

	config.map = new Map(config);

	window.menuCamera = new BABYLON.ArcRotateCamera("Camera", 0, config.titleScreenCameraBeta, config.titleScreenCameraRadius, BABYLON.Vector3.Zero(), scene);
	menuCamera.fov = 90;


	function renderLoop () {
		update(config);
		draw();
	}
	window.engine.runRenderLoop(renderLoop);

	window.playBinded = play.bind(window, config);
	document.addEventListener("click", window.playBinded, false)
}
function play(config) {
	document.removeEventListener("click", window.playBinded, false);
	window.playBinded = null;

	// TMP:
		console.log(config.meshes)

	//config.map.reset(); // ça fait des trucs chelou

	config.player = new Player(config);

	init_events(config);
	render_canvas.click();

	for(var i=0; i<config.maxAINb; i++) {
		spawnAI(config);
	}

	inGameGUI(config);

	config.is_game_title = false;
}

