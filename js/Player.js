var Player = function (config) {
	
	this.config = config;

	this.hp_max = 100;
	this.height = 2;
	this.speed = 0.016;
	this.jmp_str = 0.055;
	this.y_step_str = 0.0125;
	this.y_step_max = 1.25;
    this.canTakeDammage = true;
    this.dammageCoolDown = 1000;
    this.shootCoolDown = 100;
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
    this.camera.angularSensibility = 500; // lower is more sensible

    	this.position = this.camera.position;

    /* --- WEAPON --- */
    this.weapon = this.config.meshes.gun;
    this.weapon.isVisible = true;
    this.weapon.parent = this.camera; // The weapon will move with the player camera
    this.weapon.material = new BABYLON.StandardMaterial("weaponMat", window.scene);
    this.weapon.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    this.weapon.material.specularColor = new BABYLON.Color3(1, 0, 0);
    //this.weapon.material.wireframe = true;
    this.weapon.scaling = new BABYLON.Vector3(0.001, 0.001, 0.001);
    this.weapon.position = new BABYLON.Vector3(0.002, -0.0035, 0.0025);

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
	this.config.map.set_all_cubes_pos(this.next_pos.x, this.next_pos.z);
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

			this.next_pos.x -= Math.cos(angle) * this.dir_x * this.speed * deltaTime;
			this.next_pos.z += Math.sin(angle) * this.dir_x * this.speed * deltaTime;
			this.next_pos.x -= Math.cos(angle + this.config.half_PI) * this.dir_z * this.speed * deltaTime;
			this.next_pos.z += Math.sin(angle + this.config.half_PI) * this.dir_z * this.speed * deltaTime;
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
	}
}

Player.prototype.fire = function () {
    window.scene.beginAnimation(this.weapon, 0, 100, false, 10, null);
    var pickedInfo = scene.pick(window.innerWidth/2, window.innerHeight/2, null, false);
    if(pickedInfo.pickedMesh) {
        if(pickedInfo.pickedMesh.name.indexOf("enemy") != -1) {
            this.config.AIManager.hurtAI(pickedInfo.pickedMesh.name, this.shotDammage);
        }
        config.ParticlesManager.impactLaunch(pickedInfo.pickedPoint);
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

    this.config.GUI.drawCircle('healthCircle', Math.max(0, (this.hp/this.hp_max)));

    this.canTakeDammage = false;
    window.setTimeout(this.bindedSetCanTakeDammage, this.dammageCoolDown);

}

Player.prototype.setCanTakeDammage = function() {
    this.canTakeDammage = true;
}

Player.prototype.onKeyDown = function (keyCode) {
	if (this.config.keyBindings.jump.indexOf(keyCode) != -1) {
		if (this.can_jmp) {
			this.force_y = this.jmp_str;
			this.can_jmp = false;
		}
	} else if (this.config.keyBindings.forward.indexOf(keyCode) != -1) {
		this.dir_z = 1;
	} else if (this.config.keyBindings.backward.indexOf(keyCode) != -1) {
		this.dir_z = -1;
	} else if (this.config.keyBindings.left.indexOf(keyCode) != -1) {
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
}

Player.prototype.die = function() {
    gunsight.style.visibility = "hidden";
    window.menuCamera.target = this.position;
    window.scene.activeCamera = window.menuCamera;
    window.scene.beginAnimation(window.menuCamera, 0, 100, true);
    this.config.GUI.drawDeadScreen();
}

