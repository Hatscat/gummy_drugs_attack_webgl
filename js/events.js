"use strict"

function init_events (config) {

	render_canvas.requestPointerLock = render_canvas.requestPointerLock || render_canvas.msRequestPointerLock || render_canvas.mozRequestPointerLock || render_canvas.webkitRequestPointerLock;

	document.addEventListener("click", function (evt) {
		if (config.is_game_paused && render_canvas.requestPointerLock) {
			render_canvas.requestPointerLock();
		}
		config.player.bindedFire(evt);
	}, false);

	function pointerLockChange () {

		if (document.pointerLockElement) {
			config.is_game_paused = false;
		} else {
			config.is_game_paused = true;
		}
	}
	document.addEventListener("pointerlockchange", pointerLockChange, false);
	document.addEventListener("mozpointerlockchange", pointerLockChange, false);
	document.addEventListener("webkitpointerlockchange", pointerLockChange, false);

	document.addEventListener("keydown", function (evt) {
		config.player.onKeyDown(evt.keyCode);
	}, false);

	document.addEventListener("keyup", function (evt) {
		config.player.onKeyUp(evt.keyCode);
	}, false);
	
	// Resize the babylon engine when the window is resized
	document.addEventListener("resize", function () {
		if (window.engine) {
			window.engine.resize();
		}
	}, false);
}
