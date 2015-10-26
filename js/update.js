"use strict"

function update (config) {
	var deltaTime = window.engine.getDeltaTime();

	if (config.is_game_title || config.player.hp <= 0) {
		window.menuCamera.alpha -= config.titleScreenCameraSpeed * deltaTime;
		return;
	}
	
	config.elapsedTime += deltaTime;
	config.scoreUpdateTimer -= deltaTime;
	config.score += config.pointsPerMiliSecond * (config.drug.drug_lvl+1) * deltaTime | 0;
	
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

	if (config.drug.drug_ratio) {
		config.GUI.drawCircle('drugCircle', config.drug.drug_ratio);
	}

	config.player.update();
	config.AIManager.updateAllAI();
	config.DrugPillsManager.updateDrugs(deltaTime);
}

