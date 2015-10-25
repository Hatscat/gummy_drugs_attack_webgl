"use strict"

function update (config) {
	var deltaTime = window.engine.getDeltaTime();
	config.elapsedTime += deltaTime;

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
	if(config.player.drugToEat && !config.GUI.isEatHintShowed) {
		config.GUI.drawEatHint();
	}
	else if(!config.player.drugToEat && config.GUI.isEatHintShowed) {
		config.GUI.clearEatHint();
	}

	config.player.update();
	config.AIManager.updateAllAI();
	config.DrugManager.updateDrugs(deltaTime);
}

