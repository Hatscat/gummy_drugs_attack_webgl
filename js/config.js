"use strict"

function getConfig() {
	var config = {};

	config.meshesToLoad = {
		"enemy" : ["meshes/PoisonMushroom/", "DolPoisonMushroom.babylon"],
		"gun" : ["assets/", "gun.babylon"]
	};

	config.keyBindings = {
		"forward" :  [90], // Z
		"backward" : [83], // S
		"left" : 	 [81], // Q
		"right" : 	 [68] // D
	};

	config.mapSize = 200;

	return config;
}
