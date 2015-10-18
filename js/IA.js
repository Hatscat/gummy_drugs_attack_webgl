"use strict"

function spawnAI(config) {
	var AI = config.meshes.enemy.clone();
	AI.isVisible = true;
	AI.position.x = Math.random()*150 - 75 | 0;
	AI.position.z = Math.random()*150 - 75 | 0;
	AI.position.y = config.map.get_raw_y(config.map.get_index_from_xz(AI.position.x,AI.position.z));
	AI.scaling.x = AI.scaling.z = AI.scaling.y = 0.5;
	AI.force_y = 0;
	AI.angle = Math.PI;
	AI.nextDirectionTimer = 0;
	AI.nextJumpTimer = config.AIJumpTimer + Math.random()*config.AIJumpRandomTimer;
	config.AIs.push(AI);
}
function deleteAllAI() {
	for(var i=0; i<config.AIs.length; i++) {
		config.AIs[i].dispose();
	}
	config.AIs = [];
}
function updateAIs(config) {
	var deltaTime = window.engine.getDeltaTime();

	for(var i=0; i<config.AIs.length; i++) {
		var AI = config.AIs[i];
		var cell = config.map.get_index_from_xz(AI.position.x, AI.position.z);
		var next_map_y = config.map.get_raw_y(cell);
		
		if (!config.map.is_in_map(AI.position.x, AI.position.z) ) {
			AI.dispose();
			config.AIs.splice(i, 1);
			continue;
		}
		
		AI.nextDirectionTimer -= deltaTime;
		AI.nextJumpTimer -= deltaTime;
		var AIDistanceFromPlayer = dist_3d_sqrt(AI.position, config.player.camera.position)

		
		if(config.AICanfollowPlayer && !config.is_player_dead){
			if(AIDistanceFromPlayer < config.AIDetectionDistance) {
				AI.angle = Math.atan2(AI.position.x - config.player.camera.position.x, AI.position.z - config.player.camera.position.z) - config.AIRotOffset; //angle between player and AI
				AI.rotation.y = AI.angle + config.AIRotOffset;
				AI.stop = false;
			}
			else {
				AI.stop = true; // don't move
			}
		}

		if(config.AICanRandomMove) {
			if(AI.nextDirectionTimer <= 0) {
				AI.nextDirectionTimer = config.AIDirChangeTimer;
				AI.angle = Math.random()*Math.PI*2;
				AI.rotation.y = AI.angle + config.AIRotOffset;
			}
			AI.stop = false;
		} 

		if(config.AICanJump && !AI.stop && AI.nextJumpTimer <= 0) {
			AI.nextJumpTimer = config.AIJumpTimer + Math.random()*config.AIJumpRandomTimer;
			AI.force_y = 0.03;
		}
		if(AIDistanceFromPlayer < config.AITouchingDistance && !config.is_player_dead) {
			config.player.takeDammage(config.AIDammage);
			AI.stop = true;
		}

		// if AI can move then move
		if(!AI.stop) { 
			AI.position.x -= Math.cos(AI.angle) * config.AIspeed * deltaTime;
			AI.position.z += Math.sin(AI.angle) * config.AIspeed * deltaTime;
			AI.position.x -= Math.cos(AI.angle + config.half_PI) * config.AIspeed * deltaTime;
			AI.position.z += Math.sin(AI.angle + config.half_PI) * config.AIspeed * deltaTime;
		}

		// gravity		
		AI.force_y -= config.gravity * deltaTime;
		AI.position.y += AI.force_y * deltaTime;


		// map collision
		if (AI.position.y <= next_map_y) {
			AI.force_y = 0;
			AI.can_jmp = true;

			AI.position.y = next_map_y;
		}
	}
}