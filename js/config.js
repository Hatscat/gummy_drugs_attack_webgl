"use strict"

function getConfig() {
	var config = {};

	config.meshes = [
		"assets/ares.babylon",
	]

	config.keyBindings = {
		"forward" :  [90],
		"backward" : [83],
		"left" : 	 [81],
		"right" : 	 [68]
	}

	return config;
}
