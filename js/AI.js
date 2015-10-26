"use strict"

var AI = function(config, x, z, name) {
	this.config = config;
	this.canMove = false;
	this.CanfollowPlayer = true;
	this.canRandomMove = true;
	this.canJump = true;
	this.stop = false;
	this.maxHp = 1;
	this.hp = this.maxHp;

	this.detectionDistance = 150;
	this.touchingDistance = 5;
	this.rotOffset = Math.PI/2;
	this.speed = 0.008;
	this.jumpImpulsion = 0.04;
	this.dirChangeTimer = 1000;
	this.jumpTimer = 500;
	this.jumpRandomTimer = 250;
	this.dammage = 10;

	this.force_y = 0;
	this.angle = Math.PI;
	this.nextDirectionTimer = 0;
	this.nextJumpTimer = this.jumpTimer + Math.random()*this.jumpRandomTimer;
	this.mesh = config.meshes.enemy.createInstance(name);
	this.mesh.isVisible = true;
	this.mesh.position.x = x;
	this.mesh.position.z = z;
	this.mesh.position.y = config.map.get_raw_y(config.map.get_index_from_xz(x,z));
	this.mesh.scaling.x = this.mesh.scaling.z = this.mesh.scaling.y = 0.5;
}
AI.prototype.update = function(deltaTime) {
	var cell = this.config.map.get_index_from_xz(this.mesh.position.x, this.mesh.position.z);
	var next_map_y = this.config.map.get_raw_y(cell);
	
	
	this.nextDirectionTimer -= deltaTime;
	this.nextJumpTimer -= deltaTime;
	var distanceFromPlayer = dist_2d_sqrt(this.mesh.position, this.config.player.camera.position);

	if (distanceFromPlayer > (this.config.fog_end*1.1)*(this.config.fog_end*1.1)) {
		return false; // return false if manager needs to destroy me
	}

	
	if(this.CanfollowPlayer && this.config.player.hp > 0){
		if(distanceFromPlayer < this.detectionDistance) {
			this.angle = -Math.atan2(this.mesh.position.z - this.config.player.camera.position.z, this.mesh.position.x - this.config.player.camera.position.x); //angle between player and this
			this.mesh.rotation.y = this.angle + this.rotOffset;
			this.stop = false;
		}
		else {
			this.stop = true; // don't move
		}
	}

	if(this.canRandomMove) {
		if(this.nextDirectionTimer <= 0) {
			this.nextDirectionTimer = this.dirChangeTimer;
			this.angle = Math.random()*Math.PI*2;
			this.mesh.rotation.y = this.angle + this.rotOffset;
		}
		this.stop = false;
	} 

	if(this.canJump && !this.stop && this.nextJumpTimer <= 0) {
		this.nextJumpTimer = this.jumpTimer + Math.random()*this.jumpRandomTimer;
		this.force_y = this.jumpImpulsion;
	}
	if(distanceFromPlayer < this.touchingDistance && this.config.player.hp > 0) {
		var distance3d = dist_3d_sqrt(this.mesh.position, this.config.player.camera.position);
		if(distance3d < this.touchingDistance && this.config.player.hp > 0) {
			this.config.player.takeDammage(this.dammage);
			this.stop = true;
		}
	}

	// if this can move then move
	if(!this.stop && (this.canMove || (this.force_y != 0 && this.canJump) ) ) { 
		this.mesh.position.x -= Math.cos(this.angle) * this.speed * deltaTime;
		this.mesh.position.z += Math.sin(this.angle) * this.speed * deltaTime;
	}

	// gravity
	this.force_y -= this.config.gravity * deltaTime;
	this.mesh.position.y += this.force_y * deltaTime;

	// map collision
	if (this.mesh.position.y <= next_map_y) {
		this.force_y = 0;
		this.mesh.position.y = next_map_y;
	}

	return true; // update happend normally
}
