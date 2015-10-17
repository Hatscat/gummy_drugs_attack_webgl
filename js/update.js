"use strict"

function update (config) {
	var deltaTime = window.engine.getDeltaTime();

	if (config.is_game_title || config.is_player_dead) {
		window.menuCamera.alpha -= config.titleScreenCameraSpeed * deltaTime;
	}
	else if(!config.is_player_dead) {
		config.scoreUpdateTimer -= deltaTime;
		config.score += config.pointsPerSecond * deltaTime/1000 | 0;
		if(config.scoreUpdateTimer <= 0) {
			drawScore(config.score);
			config.scoreUpdateTimer = config.scoreUpdateInterval;
		}
		
		config.player.update();
	}
	updateAIs(config)
}

