"use strict"

function getConfig() {
	var config = {};

	config.half_PI = Math.PI * 0.5;
	config.gravity = 0.005;
	config.y_min = 0;
	config.y_max = 30;
	config.mapSize = 300;
	config.meshesToLoad = {
		"ship" : "assets/ares.babylon",
		"gun" : "assets/gun.babylon"
	};

	config.keyBindings = {
		"jump": [32],
		"forward" :  [90],
		"backward" : [83],
		"left" : 	 [81],
		"right" : 	 [68]
	};


	return config;
}
