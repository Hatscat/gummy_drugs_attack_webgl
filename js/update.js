"use strict"

function update (config) {
	var deltaTime = window.engine.getDeltaTime();

	if (config.is_game_title || config.player.hp <= 0) {
		window.menuCamera.alpha -= config.titleScreenCameraSpeed * deltaTime;
		return;
	}
	
	config.scoreUpdateTimer -= deltaTime;
	config.score += config.pointsPerMiliSecond * deltaTime | 0;
	
	if (config.scoreUpdateTimer <= 0) {
		drawScore(config.score);
		config.scoreUpdateTimer = config.scoreUpdateInterval;
	}
	
	config.player.update();
	config.AIManager.updateAllAI(config);
}

