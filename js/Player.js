"use strict"
// require tools.js

var Player = function (config) {

	this.config = config;

	this.hp_max = 100;
	this.hp_drug_heal = 3; 
	this.height = 2;
	this.minSpeed = 0.014;
	this.maxSpeed = 0.022;
	this.jmp_str_min = 0.025;
	this.jmp_str_max = 0.05;
	this.y_step_str = 0.0125;
	this.y_step_max = 1.25;
	this.canTakeDammage = true;
	this.dammageCoolDown = 150;
	this.minShootCoolDown = 50;
	this.maxShootCoolDown = 200;
	this.currentShootCoolDown = 0;
	this.shotDammage = 1;

	this.reset();

	/* --- CAMERA --- */
	this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(this.next_pos.x, this.next_pos.y, this.next_pos.z), window.scene); // change with a simpler camera
	window.scene.activeCamera = this.camera;

	this.camera.attachControl(window.render_canvas);
	this.camera.fov = this.config.half_PI;
	this.camera.minZ = 0.001;
	this.camera.maxZ = this.config.fog_end;
	this.camera.ellipsoid = null;
	this.camera.checkCollisions = false;
	this.camera.applyGravity = false;
	this.camera.keysUp = [];
	this.camera.keysDown = [];
	this.camera.keysLeft = [];
	this.camera.keysRight = [];
	this.camera.speed = 0;
	this.camera.inertia = 0;
	this.camera.angularSensibility = 300; // lower is more sensible
	this.camera.attachPostProcess(this.config.drug.post_process);

	this.position = this.camera.position;

	/* --- WEAPON --- */
	this.weapon = this.config.meshes.gun;
	this.weapon.setEnabled(true);
	this.weapon.parent = this.camera; // The weapon will move with the player camera
	this.weapon.material = new BABYLON.StandardMaterial("weaponMat", window.scene);
	this.weapon.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
	this.weapon.material.specularColor = new BABYLON.Color3(1, 0, 0);
	this.weapon.scaling = new BABYLON.Vector3(0.001, 0.001, 0.001);
	this.weapon.position = new BABYLON.Vector3(window.innerWidth * 1.1e-6, -0.0035, 0.0025);

	var end_position = this.weapon.position.clone();
	end_position.z -= 0.001;
	var display = new BABYLON.Animation("fire", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	var anim_keys = [
	{
		frame: 0,
			value: this.weapon.position
	},
	{
		frame: 10,
		value: end_position
	},
	{
		frame: 100,
		value: this.weapon.position
	}
	];

	display.setKeys(anim_keys);
	this.weapon.animations.push(display);

	this.bindedFire = this.fire.bind(this);
	this.bindedSetCanTakeDammage = this.setCanTakeDammage.bind(this);
}

Player.prototype.reset = function () {

	this.next_cell_col = this.config.map.get_col_from_x(0);
	this.current_cell_col = this.next_cell_col;
	this.next_cell_row = this.config.map.get_row_from_z(0);
	this.current_cell_row = this.next_cell_row;
	this.next_map_y = this.config.map.get_raw_y(this.config.map.get_index_from_col_row(this.next_cell_col, this.next_cell_row)) + this.height;
	this.current_map_y = this.next_map_y;
	this.next_pos = { x: 0, y: this.next_map_y, z: 0 };
	this.dir_z = 0;
	this.dir_x = 0;
	this.force_y = 0;
	this.can_jmp = true;
	this.hp = this.hp_max;
}

Player.prototype.update = function () {

	var deltaTime = window.engine.getDeltaTime();

	this.current_map_y = this.next_map_y;
	this.next_map_y = this.config.map.get_raw_y(this.config.map.get_index_from_xz(this.next_pos.x, this.next_pos.z)) + this.height;

	// collision avec un mur
	if (this.next_pos.y <= this.next_map_y && Math.abs(this.next_map_y - this.current_map_y) > this.y_step_max) {

		this.next_pos.x = this.position.x;
		this.next_pos.z = this.position.z;
		this.can_jmp = true;

	} else {

		this.position.x = this.next_pos.x;
		this.position.z = this.next_pos.z;
		this.position.y = this.next_pos.y;

		if (this.dir_x || this.dir_z) { // déplacements

			var angle = this.camera.rotation.y;
			var speed = lerp(this.minSpeed, this.maxSpeed, this.config.drug.drug_ratio);
			this.next_pos.x -= Math.cos(angle) * this.dir_x * speed * deltaTime;
			this.next_pos.z += Math.sin(angle) * this.dir_x * speed * deltaTime;
			this.next_pos.x -= Math.cos(angle + this.config.half_PI) * this.dir_z * speed * deltaTime;
			this.next_pos.z += Math.sin(angle + this.config.half_PI) * this.dir_z * speed * deltaTime;
		}

		// gravité
		this.force_y -= this.config.gravity * deltaTime;
		this.next_pos.y += this.force_y * deltaTime;

		// collision avec le terrain
		if (this.next_pos.y <= this.next_map_y) {

			this.force_y = 0;
			this.can_jmp = true;

			this.next_pos.y = Math.min(this.next_map_y, this.next_pos.y + Math.max(1, this.next_map_y - this.next_pos.y) * this.y_step_str * deltaTime);
		}

		var col = this.config.map.get_col_from_x(this.position.x);
		var row = this.config.map.get_row_from_z(this.position.z);

		// new cell
		if (col != this.next_cell_col || row != this.next_cell_row) {

			this.next_cell_col = col;
			this.next_cell_row = row;

			// update de la map visible
			var dir_x = this.next_cell_col - this.current_cell_col;
			var dir_z = this.next_cell_row - this.current_cell_row;

			this.config.map.set_cubes_pos(this.position.x, this.position.z, dir_x, dir_z);

			this.current_cell_col = this.next_cell_col;
			this.current_cell_row = this.next_cell_row;
		}

		this.currentShootCoolDown -= deltaTime;
		if (this.config.isMouseDown && this.currentShootCoolDown <= 0) {
			this.currentShootCoolDown = lerp(this.maxShootCoolDown, this.minShootCoolDown, this.config.drug.drug_ratio);
			this.bindedFire();
		}		
	}
}

Player.prototype.fire = function () {
	window.scene.beginAnimation(this.weapon, 0, 100, false, 10, null);
	this.config.sounds.shot.play();

	var pickedInfo = window.scene.pick(window.innerWidth * 0.5, window.innerHeight * 0.5, null, false);

	if (pickedInfo.pickedMesh && pickedInfo.pickedMesh.name) {
		if (pickedInfo.pickedMesh.name.indexOf("enemy") != -1) {
			this.config.AIManager.hurtAI(pickedInfo.pickedMesh.name, this.shotDammage);
		}
		this.config.ParticlesManager.launch("impact", pickedInfo.pickedPoint);
	}

}
Player.prototype.takeDammage = function (dam) {
	if(!this.canTakeDammage) {
		return;
	}
	this.hp -= dam;

	if(this.hp <= 0) {
		if(this.config.is_dev_mode) {
			this.hp = this.hp_max;
		}
		else {
			this.die();
			return;
		}
	}
	this.config.sounds.hurt.play();

	this.config.GUI.drawCircle('healthCircle', Math.max(0, (this.hp / this.hp_max)));

	this.canTakeDammage = false;
	window.setTimeout(this.bindedSetCanTakeDammage, this.dammageCoolDown);

}

Player.prototype.setCanTakeDammage = function() {
	this.canTakeDammage = true;
}

Player.prototype.onKeyDown = function (keyCode) {
	if (this.config.keyBindings.jump.indexOf(keyCode) != -1) {
		if (this.can_jmp) {
			this.force_y = lerp(this.jmp_str_min, this.jmp_str_max, this.config.drug.drug_ratio);
			this.can_jmp = false;
		}
	}
	if (this.config.keyBindings.forward.indexOf(keyCode) != -1) {
		this.dir_z = 1;
	} else if (this.config.keyBindings.backward.indexOf(keyCode) != -1) {
		this.dir_z = -1;
	}
	if (this.config.keyBindings.left.indexOf(keyCode) != -1) {
		this.dir_x = 1;
	} else if (this.config.keyBindings.right.indexOf(keyCode) != -1) {
		this.dir_x = -1;
	}
}

Player.prototype.onKeyUp = function (keyCode) {
	if (this.config.keyBindings.forward.indexOf(keyCode) != -1 || this.config.keyBindings.backward.indexOf(keyCode) != -1) {
		this.dir_z = 0;
	} else if (this.config.keyBindings.left.indexOf(keyCode) != -1 || this.config.keyBindings.right.indexOf(keyCode) != -1) {
		this.dir_x = 0;
	}

	if (this.config.is_dev_mode && keyCode == 49) { // & 
		this.config.drug.add();
	}
}

Player.prototype.die = function() {
	this.config.sounds.die.play();
	this.hp = 0;
	if (this.config.score > this.config.highscore && !this.config.is_dev_mode) {
		window.localStorage.drugs_attack_highscore = this.config.highscore = this.config.score;
	}
	gunsight.style.visibility = "hidden";
	window.menuCamera.target = this.position;
	window.scene.activeCamera = window.menuCamera;
	window.scene.beginAnimation(window.menuCamera, 0, 100, false);
	this.config.GUI.drawDeadScreen();
}

Player.prototype.eat = function() {
	this.config.sounds.eat.play();
	this.config.drug.add();
	this.config.score += this.config.drug_pill_score_value;
	this.config.GUI.drawScore();
	this.hp = Math.min(this.hp_max, this.hp + this.hp_drug_heal);
	this.config.GUI.drawCircle('healthCircle', Math.max(0, (this.hp / this.hp_max)));
}

