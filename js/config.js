"use strict"

function getConfig () {
	var config = {};

	config.is_dev_mode = location.href.indexOf('?') != -1;
	config.is_game_title = true;

	config.half_PI = Math.PI * 0.5;
	config.gravity = 0.00016;
	config.fog_start = 0;
	config.fog_end = 70;
	config.map_side_n = 9;
	config.cube_size = 10;
	config.cube_height = 0.5;
	config.map_noise_coef = 2;
	config.map_visibility_n = Math.ceil(config.fog_end / config.cube_size) + 2;
	config.light_color = new BABYLON.Color3(0.7, 0, 0);

	config.meshes = {};
	config.imgs = {};
	config.textures = {};

	config.imgToLoad = {
		"title": "assets/title" + (Math.random()*4 | 0) + ".png" // to choose a title font img in random,
	}

	config.texturesToLoad = {
		"gunImpactParticle": "assets/gunImpactParticle.png"
	}

	config.meshesToLoad = {
		"enemy" : ["assets/mushroom_final/", "mushroom_final.babylon"],
		"gun" : ["assets/PowerRifle/", "PowerRifle.babylon"]
	};

	config.keyBindings = {
		"jump": [32],
		"forward" :  [90], // Z
		"backward" : [83], // S
		"left" : 	 [81], // Q
		"right" : 	 [68] // D
	};

	config.titleScreenCameraBeta = Math.PI/6;
	config.titleScreenCameraRadius = 150;
	config.titleScreenCameraSpeed = 0.00005;

	config.score = 0;
	config.pointsPerMiliSecond = 0.1;
	config.pointPerEnemyKilled = 250;
	config.scoreUpdateTimer = 100;
	config.scoreUpdateInterval = 100;

	return config;
}
