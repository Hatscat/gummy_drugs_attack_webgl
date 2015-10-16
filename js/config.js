"use strict"

function getConfig() {
	var config = {};

	config.is_dev_mode = true;
	config.is_game_paused = true;
	config.half_PI = Math.PI * 0.5;
	config.gravity = 0.00016;
	config.fog_start = 0;
	config.fog_end = 80;
	config.map_side_n = 4;
	config.cube_size = 10;

	config.meshes = {};
	config.imgs= {};

	config.imgToLoad = {
		"title": "assets/title" + (Math.random()*4 | 0) + ".png" // to choose a title font img in random,
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

	config.healthCircle = {
		x: -0.44, //screenPercent from middle
		y: 0.01, //screenPercent from bottom
		radius: 0.05, //screenWidthPercent
		innerColor: "red",
		outterColor: "black",
		fillPercent: 1
	}
	config.drugCircle = {
		x: 0.44,
		y: 0.01,
		radius: 0.05,
		innerColor: "rainbow",
		outterColor: "black",
		fillPercent: 1
	}

	config.titleScreenCameraBeta = Math.PI/6;
	config.titleScreenCameraRadius = 150;
	config.titleScreenCameraSpeed = 0.05;

	return config;
}
