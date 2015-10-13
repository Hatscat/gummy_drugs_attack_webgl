"use strict"

function update (config) {

	if (config.is_game_paused) {
		return;
	}
	
	config.player.update();
}

