"use strict"

function update (config) {

	var deltaTime = window.engine.getDeltaTime();

	if (config.is_game_title || config.player.hp <= 0) {
		window.menuCamera.alpha -= config.titleScreenCameraSpeed * deltaTime;
		return;
	}

	config.elapsedTime += deltaTime;
	
	if (config.DrugPillsManager.yum_timer > 0) {

		config.DrugPillsManager.yum_timer -= deltaTime;

		if (!config.GUI.isEatHintShowed) {
			config.GUI.drawEatHint();
		}

	} else if (config.GUI.isEatHintShowed) {

		config.DrugPillsManager.yum_timer = 0;
		config.GUI.clearEatHint();
	}

	if (config.drug.drug_ratio) {

		config.GUI.drawCircle('drugCircle', config.drug.drug_ratio);
	}

	config.player.update();
	config.AIManager.updateAllAI();
	config.DrugPillsManager.updateDrugs(deltaTime);
}

