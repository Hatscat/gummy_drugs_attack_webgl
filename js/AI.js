"use strict"

var AI = function (config, x, z, name) {

	this.config = config;
	this.canJump = true;
	this.maxHp = 1;
	this.hp = this.maxHp;
	this.is_alive = true;
	this.is_recovering = false;

	this.detectionDistance = 225;
	this.touchingDistance = 5;
	this.speed = 0.007;
	this.jump_pulse = 0.03;
	this.time_between_jumps = 180;
	this.jump_timer = 0;
	this.dirChangeTimer = 1000;
	this.damage = 3;
	this.recovering_pulse = 0.004;
	this.death_pulse = 0.022;
	this.height = 3;

	this.force_y = 0;
	this.angle = Math.PI;
	this.nextDirectionTimer = 0;
	this.mesh = config.meshes.ai.createInstance(name);
	this.mesh.isVisible = true;
	this.mesh.position.x = x;
	this.mesh.position.z = z;
	this.mesh.position.y = config.map.get_raw_y(config.map.get_index_from_xz(x,z));
	this.mesh.scaling.x = this.mesh.scaling.z = this.mesh.scaling.y = 0.5;
}

AI.prototype.update = function (deltaTime) {
	
	var next_map_y = this.config.map.get_raw_y(this.config.map.get_index_from_xz(this.mesh.position.x, this.mesh.position.z));
	
	// gravity
	this.force_y -= this.config.gravity * deltaTime;
	this.mesh.position.y += this.force_y * deltaTime;

	if (this.is_alive) {
		
		// map collision
		if (this.mesh.position.y < next_map_y) {

			this.force_y = 0;
			this.is_recovering = false;
			this.mesh.position.y = next_map_y;

			this.jump_timer -= deltaTime;

			if (this.jump_timer < 0) {
				this.canJump = true;
			}
		}

		if (this.is_recovering) {

			this.bounce(this.recovering_pulse * deltaTime);

		} else {

			var distanceFromPlayer = dist_2d_sqrt(this.mesh.position, this.config.player.position);

			if (distanceFromPlayer > (this.config.fog_end * 1.1) * (this.config.fog_end * 1.1)) {
				return false; // return false if manager needs to destroy me
			}

			if (this.config.player.hp > 0) {

				if (distanceFromPlayer < this.detectionDistance) {

					this.angle = -Math.atan2(this.mesh.position.z - this.config.player.position.z, this.mesh.position.x - this.config.player.position.x); //angle between player and this
					this.mesh.rotation.y = this.angle + this.config.half_PI;

					if (distanceFromPlayer < this.touchingDistance && dist_3d_sqrt(this.mesh.position, this.config.player.position) < this.touchingDistance) {
						this.config.player.takeDammage(this.damage);
						this.is_recovering = true;
					}

				} else {

					this.nextDirectionTimer -= deltaTime;

					if (this.nextDirectionTimer <= 0) {
						this.nextDirectionTimer = this.dirChangeTimer;
						this.angle = Math.random() * Math.PI * 2;
						this.mesh.rotation.y = this.angle + this.config.half_PI;
					}
				}

				if (this.canJump) {
					this.canJump = false;
					this.jump_timer = this.time_between_jumps;
					this.force_y = this.jump_pulse;
				} else if (this.jump_timer == this.time_between_jumps) {
					this.mesh.position.x -= Math.cos(this.angle) * this.speed * deltaTime;
					this.mesh.position.z += Math.sin(this.angle) * this.speed * deltaTime;
				}
			}
		}

	} else {
		
		this.pulse_from_player(this.death_pulse * deltaTime);

		if (this.mesh.position.y < next_map_y - this.height) {
			this.config.AIManager.killAI(this.mesh.name, true);
		}
	}

	return true; // update happend normally
}

AI.prototype.pulse_from_player = function (pulse_str) {

	this.angle = this.config.player.camera.rotation.y + this.config.half_PI;
	this.mesh.position.x -= Math.cos(this.angle) * pulse_str;
	this.mesh.position.z += Math.sin(this.angle) * pulse_str;
}

AI.prototype.bounce = function (pulse_str) {

	this.angle = this.mesh.rotation.y + this.config.half_PI;
	this.mesh.position.x -= Math.cos(this.angle) * pulse_str;
	this.mesh.position.z += Math.sin(this.angle) * pulse_str;
}


