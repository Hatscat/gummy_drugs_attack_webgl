"use strict"

var DrugPill = function(config, x, z, name) {
	this.config = config;
	this.timeBeforeDeletion = 6000;
	this.touchingDistance = 6;
	this.size = 1;

	this.mesh = config.meshes.drug.clone(name);
	this.mesh.isVisible = true;
	this.mesh.position.x = x;
	this.mesh.position.z = z;
	this.mesh.position.y = config.map.get_raw_y(config.map.get_index_from_xz(x,z)) + this.size/2;
	this.mesh.material = config.DrugPillsManager.drugsMaterials[(Math.random() * config.DrugPillsManager.drugsMaterialsNb | 0)];

	this.force_y = 0;
	this.y_limit = this.mesh.position.y - this.size;
}

DrugPill.prototype.update = function(deltaTime) {
	this.timeBeforeDeletion -= deltaTime;
	if (dist_3d_sqrt(this.mesh.position, this.config.player.camera.position) <= this.touchingDistance) {
		this.config.player.eat();
		this.config.DrugPillsManager.deleteDrug(this.mesh.name);
		this.config.DrugPillsManager.yum_timer = this.config.DrugPillsManager.yum_timer_max;
		return true;
	}
	if (this.timeBeforeDeletion <= 0) {
		return false; // return false if manager needs to destroy me
	}
	return true; // update happend normally
}
