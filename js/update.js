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
		config.GUI.drawScore();
		config.scoreUpdateTimer = config.scoreUpdateInterval;
	}

	config.player.currentShootCoolDown -= deltaTime;
	if(config.isMouseDown && config.player.currentShootCoolDown <= 0) {
		config.player.currentShootCoolDown = config.player.shootCoolDown;
		config.player.bindedFire();
	}
	config.player.update();
	config.AIManager.updateAllAI(config);
}

