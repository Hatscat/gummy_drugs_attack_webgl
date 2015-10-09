"use strict"

function getConfig() {
	var config = {};

	config.meshesToLoad = {
		"ship" : "assets/ares.babylon",
		"gun" : "assets/gun.babylon"
	};

	config.keyBindings = {
		"forward" :  [90],
		"backward" : [83],
		"left" : 	 [81],
		"right" : 	 [68]
	};

	config.mapSize = 200;

	return config;
}
