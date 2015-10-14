"use strict"

function getConfig() {
	var config = {};

	config.is_dev_mode = true;
	config.is_game_paused = true;
	config.half_PI = Math.PI * 0.5;
	config.gravity = 0.00016;
	config.fog_limit = 10;
	config.map_side_n = 4;
	config.cube_size = 10;
	config.meshesToLoad = {
		"enemy" : ["assets/PoisonMushroom/", "DolPoisonMushroom.babylon"],
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
		innerColor: "blue",
		outterColor: "black",
		fillPercent: 0.5
	}

	return config;
}
