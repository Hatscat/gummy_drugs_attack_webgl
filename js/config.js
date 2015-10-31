"use strict"

function getConfig () {
	var config = {};

	config.is_dev_mode = location.href.indexOf('?') != -1;
	config.is_game_title = true;

	config.half_PI = Math.PI * 0.5;
	config.gravity = 0.00008;
	config.fog_start = 0;
	config.map_side_n = 9;
	config.cube_size = 11;
	config.cube_height = 0.5;
	config.map_noise_coef = 2;
	config.map_visibility = 7;
	config.fog_end = config.cube_size * config.map_visibility;
	config.light_color = new BABYLON.Color3(0.7, 0, 0);

	config.meshes = {};
	config.imgs = {};
	config.textures = {};
	config.sounds = {};

	config.imgToLoad = {
		"title": "assets/title" + (Math.random()*4 | 0) + ".png" // to choose a title font img in random,
	}

	config.texturesToLoad = {
		"gunImpactParticle": "assets/gunImpactParticle.png"
	}

	config.soundsConfig = {
		"shot" : {src:"assets/sounds/pew.mp3", options: {volume: 0.5} },
		"hurt" :  {src:"assets/sounds/hurt.mp3" },
		"eat" :  {src:"assets/sounds/eat.mp3" },
		"die" :  {src:"assets/sounds/die.mp3", options: {volume: 1.1} },
		"BGM" : {src:"assets/sounds/RunAmok.mp3", options: { loop: true, autoplay: true } }
	}

	config.meshesToLoad = {
		"ai" : ["assets/mushroom_final/", "mushroom_final.babylon"],
		"gun" : ["assets/PowerRifle/", "PowerRifle.babylon"]
	};

	config.keyBindings = {
		"jump": [32], // <space>
		"forward": [90, 87], // Z, W
		"backward": [83], // S
		"left": [81, 65], // Q, A
		"right": [68] // D
	};

	config.titleScreenCameraBeta = Math.PI * 0.15;
	config.titleScreenCameraRadius = 33;
	config.titleScreenCameraSpeed = 0.00005;

	config.score = 0;
	config.highscore = localStorage.drugs_attack_highscore | 0;
	config.drug_pill_score_value = 42;
	
	config.elapsedTime = 0;

	return config;
}

