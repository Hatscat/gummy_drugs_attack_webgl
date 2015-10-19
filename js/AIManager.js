"use strict"

var AIManager = function(config) {
	this.config = config;
	this.AIs = [];
	this.maxAINb = 500;
}

AIManager.prototype.spawnAI = function() {
	var x = Math.random()*150 - 75 | 0 //TODO a real spawn algo
	var z = Math.random()*150 - 75 | 0 //TODO a real spawn algo
	this.AIs.push(new AI(config, x, z));
}

AIManager.prototype.deleteAllAI = function() {
	for(var i=0; i<this.AIs.length; i++) {
		this.AIs[i].mesh.dispose();
	}
	this.AIs = [];
}

AIManager.prototype.updateAllAI = function() {
	var deltaTime = window.engine.getDeltaTime();
	for(var i=0; i<this.AIs.length; i++) {
		var isUpdateNormal = this.AIs[i].update(deltaTime); // if the AI needs to be removed, its update returns false
		if(!isUpdateNormal) {
			this.AIs.splice(i, 1);
			continue;
		}
	}
}