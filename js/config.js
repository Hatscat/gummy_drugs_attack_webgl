"use strict"

function getConfig() {
	var config = {};

	config.half_PI = Math.PI * 0.5;
	config.gravity = 0.002;
	config.y_min = -10;
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
