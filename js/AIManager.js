"use strict"

var AIManager = function(config) {
	this.config = config;
	this.AIs = {};
	this.maxAINb = 500;
	this.AIcount = 0;
}

AIManager.prototype.spawnAI = function() {
	var x = Math.random()*150 - 75 | 0 //TODO a real spawn algo
	var z = Math.random()*150 - 75 | 0 //TODO a real spawn algo
	var name = "enemy" + this.AIcount;
	this.AIs[name] = new AI(config, x, z, name);
	this.AIcount++;
}

AIManager.prototype.deleteAllAI = function() {
	for(var i in this.AIs) {
		this.AIs[i].mesh.dispose();
	}
	this.AIs = {}; 
}
AIManager.prototype.hurtAI = function(name, dammage) {
	this.AIs[name].hp -= dammage;
	if(this.AIs[name].hp <= 0) {
		this.killAI(name);
	}
}
AIManager.prototype.killAI = function(name) {
	//TODO particles
	this.AIs[name].mesh.dispose();
	this.config.score += this.config.pointPerEnemyKilled;
	delete this.AIs[name]; // remove key i from structure
}

AIManager.prototype.updateAllAI = function() {
	var deltaTime = window.engine.getDeltaTime();
	for(var i in this.AIs) {
		var isUpdateNormal = this.AIs[i].update(deltaTime); // if the AI needs to be removed, its update returns false
		if(!isUpdateNormal) {
			delete this.AIs[i]; // remove key i from structure
			continue;
		}
	}
}