"use strict"

function init_events (config) {
	render_canvas.requestPointerLock = render_canvas.requestPointerLock || render_canvas.msRequestPointerLock || render_canvas.mozRequestPointerLock || render_canvas.webkitRequestPointerLock;

	document.addEventListener("click", function (evt) {
		if (render_canvas.requestPointerLock) {
			render_canvas.requestPointerLock();
		} else {
			alert("No pointer lock possible, please use a real browser");
		}

		if (config.player.hp <= 0) {

			config.map.diamond_sqrt(config.map.side_len);
			config.map.set_all_cubes_pos(0, 0);

			window.scene.activeCamera = config.player.camera;
			gunsight.style.visibility = "visible";
			config.score = 0;
			config.healthCircle.fillPercent = 1;
			inGameGUI(config);
			
			config.player.reset();
		}

	}, false);

	document.addEventListener("mousedown", function (evt) {
		config.isMouseDown = true;
	}, false);

	document.addEventListener("mouseup", function (evt) {
		config.isMouseDown = false;
	}, false);

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
