"use strict"

function update (config) {

	if (config.is_game_paused) {
		return;
	}

	var deltaTime = window.engine.getDeltaTime();

	if (config.player.dir_x || config.player.dir_z) { // pré-déplacements
		
		var angle = config.player.camera.rotation.y;
/*
		config.player.sphere.position.x -= Math.cos(angle) * config.player.dir_x * config.player.speed * deltaTime;
		config.player.sphere.position.z += Math.sin(angle) * config.player.dir_x * config.player.speed * deltaTime;
		config.player.sphere.position.x -= Math.cos(angle + config.half_PI) * config.player.dir_z * config.player.speed * deltaTime;
		config.player.sphere.position.z += Math.sin(angle + config.half_PI) * config.player.dir_z * config.player.speed * deltaTime;
*/
		config.player.camera.position.x -= Math.cos(angle) * config.player.dir_x * config.player.speed * deltaTime;
		config.player.camera.position.z += Math.sin(angle) * config.player.dir_x * config.player.speed * deltaTime;
		config.player.camera.position.x -= Math.cos(angle + config.half_PI) * config.player.dir_z * config.player.speed * deltaTime;
		config.player.camera.position.z += Math.sin(angle + config.half_PI) * config.player.dir_z * config.player.speed * deltaTime;
	}

	if (config.player.force_y) {
		config.player.force_y -= config.gravity;
		//config.player.sphere.position.y += config.player.force_y * deltaTime;
		config.player.camera.position.y += config.player.force_y * deltaTime;
	}

/*	if (config.player.sphere.intersectsMesh(config.ground, true)) {
		config.player.can_jmp = true;
		config.player.force_y = 0;
		config.player.sphere.position.x = config.player.previous_pos.x;
		config.player.sphere.position.y = config.player.previous_pos.y;
		config.player.sphere.position.z = config.player.previous_pos.z;

	} else {
		config.player.previous_pos.x = config.player.camera.position.x;
		config.player.previous_pos.y = config.player.camera.position.y;
		config.player.previous_pos.z = config.player.camera.position.z;

		config.player.camera.position.x = config.player.sphere.position.x;
		config.player.camera.position.y = config.player.sphere.position.y;
		config.player.camera.position.z = config.player.sphere.position.z;
	}
*/
}

