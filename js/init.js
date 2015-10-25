"use strict"
window.onload = init;

function init () {
	render_canvas.width = window.innerWidth;
	render_canvas.height = window.innerHeight;

	window.config = getConfig(); //TMP

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
	var textureLoadBinded =  textureLoaded.bind(window, config);

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
	for(var i in config.texturesToLoad) {
		var img = loader.addTextureTask(i, config.texturesToLoad[i]);
		img.onSuccess = textureLoadBinded;
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
	config.meshes[task.name].setEnabled(false);
}

function imgLoaded(config, task) {
	config.imgs[task.name] = task.image;
}

function textureLoaded(config, task) {
	config.textures[task.name] = task.texture;
}

function onAssetsLoaded (config) {

	config.GUI = new GUI(config);
	config.GUI.drawTitleScreen();

	config.map = new Map(config);
	config.map.set_all_cubes_pos(0, 0);

	var radius = config.map.get_raw_y(config.map.get_index_from_xz(0,0)) + config.titleScreenCameraRadius;
	window.menuCamera = new BABYLON.ArcRotateCamera("Camera", 0, config.titleScreenCameraBeta, radius, BABYLON.Vector3.Zero(), scene);
	menuCamera.fov = 90;

	var display = new BABYLON.Animation("death", "radius", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var anim_keys = [
		{
			frame: 0,
			value: 10
		},
		{
			frame: 100,
			value: config.titleScreenCameraRadius
		}
	];

    display.setKeys(anim_keys);
    menuCamera.animations.push(display);


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

	config.player = new Player(config);
	config.AIManager = new AIManager(config)
	config.ParticlesManager = new ParticlesManager(config);
	config.DrugManager = new DrugManager(config);

	init_events(config);
	render_canvas.click();

	config.GUI.inGameGUI();

	config.is_game_title = false;
}

