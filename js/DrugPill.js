"use strict"

var DrugPill = function(config, x, z, name) {
	this.config = config;
	this.timeBeforeDeletion = 5000;
	this.touchingDistance = 10;
	this.size = 1;

	this.mesh = config.meshes.drug.clone(name);
	this.mesh.isVisible = true;
	this.mesh.position.x = x;
	this.mesh.position.z = z;
	this.mesh.position.y = config.map.get_raw_y(config.map.get_index_from_xz(x,z)) + this.size/2;
	this.mesh.material = config.DrugPillsManager.drugsMaterials[(Math.random() * config.DrugPillsManager.drugsMaterialsNb | 0)];
}

DrugPill.prototype.update = function(deltaTime) {
	this.timeBeforeDeletion -= deltaTime;
	if(!this.config.player.drugToEat) {
		var distanceFromPlayer = dist_3d_sqrt(this.mesh.position, this.config.player.camera.position);
		if(distanceFromPlayer <= this.touchingDistance) {
			this.config.player.drugToEat = this.mesh.name;
		}
	}
	if(this.timeBeforeDeletion <= 0) {
		return false; // return false if manager needs to destroy me
	}
	return true; // update happend normally
}