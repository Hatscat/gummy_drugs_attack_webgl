"use strict"

var AIManager = function(config) {
	this.config = config;
	this.AIs = {};
	this.maxAINb = 1000;
	this.AINameCount = 0;
	this.AICount = 0;
	this.spawnCapTime = 300000; // time when the spawn is limited to the maximum sprites
}

AIManager.prototype.spawnAI = function() {
	var angle = Math.random() * Math.PI * 2;
	var x = this.config.player.position.x + Math.cos(angle) * this.config.fog_end;
	var z = this.config.player.position.z - Math.sin(angle) * this.config.fog_end;
	var name = "enemy" + this.AINameCount;
	this.AIs[name] = new AI(this.config, x, z, name);
	++this.AINameCount;
	++this.AICount;
}

AIManager.prototype.deleteAllAI = function() {
	for(var i in this.AIs) {
		this.AIs[i].mesh.dispose();
	}
	this.AICount = 0;
	this.AINameCount = 0;
	this.AIs = {}; 
}
AIManager.prototype.hurtAI = function(name, dammage) {
	this.AIs[name].hp -= dammage;
	if(this.AIs[name].is_alive && this.AIs[name].hp <= 0) {
		this.AIs[name].force_y = this.AIs[name].jump_pulse * 0.4;
		this.AIs[name].is_alive = false;
		this.config.ParticlesManager.launch("AIDeath", this.AIs[name].mesh.position);
	}
}
AIManager.prototype.killAI = function(name, isFromPlayer) {

	if(isFromPlayer) {
		this.config.DrugPillsManager.spawnDrug(this.AIs[name].mesh.position.x, this.AIs[name].mesh.position.z);
	}

	this.AIs[name].mesh.dispose();
	delete this.AIs[name]; // remove key i from structure
	--this.AICount;

}

AIManager.prototype.updateAllAI = function() {
	var deltaTime = window.engine.getDeltaTime();
	for(var i in this.AIs) {
		var isUpdateNormal = this.AIs[i].update(deltaTime); // if the AI needs to be removed, its update returns false
		if(!isUpdateNormal) {
			this.killAI(i, false);
			continue;
		}
	}

	if(this.AICount < this.maxAINb) {
		var enemyToSpawnNb = this.config.elapsedTime * this.maxAINb / this.spawnCapTime - this.AICount | 0;
		for(var i=0; i<enemyToSpawnNb; i++) {
			this.spawnAI();
		}
	}
}
