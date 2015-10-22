var Player = function (config) {
	
	this.config = config;

	this.hp_max = 100;
	this.height = 2;
	this.speed = 0.016;
	this.jmp_str = 0.05;
	this.y_step_max = 1;
    this.canTakeDammage = true;
    this.dammageCoolDown = 1000;
	
	this.reset();

    /* --- CAMERA --- */
    this.camera = new BABYLON.FreeCamera("camera", this.start_pos, window.scene); // change with a simpler camera
    window.scene.activeCamera = this.camera;

    this.camera.attachControl(window.render_canvas);
    this.camera.fov = this.config.half_PI;
    this.camera.minZ = 0.001;
    //this.camera.maxZ = this.config.fog_end;
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
/*
    var end_rotation = this.weapon.rotation.clone();
    end_rotation.x -= Math.PI / 12;
    var display = new BABYLON.Animation("fire", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var anim_keys = [
        {
            frame: 0,
            value: this.weapon.rotation
        },
        {
            frame: 10,
            value: end_rotation
        },
        {
            frame: 100,
            value: this.weapon.rotation
        }
    ];
  */
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


    /*this.particleSystem = new BABYLON.ParticleSystem("particles", 100, scene );
    this.particleSystem.emitter = this.weapon; // the starting object, the emitter
    this.particleSystem.particleTexture = new BABYLON.Texture("assets/particles/gunshot_125.png", scene);
    this.particleSystem.emitRate = 5;
    this.particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    this.particleSystem.minEmitPower = 1;
    this.particleSystem.maxEmitPower = 3;
    this.particleSystem.colorDead = new BABYLON.Color4(1, 1, 1, 0.0);
    this.particleSystem.minLifeTime = 0.2;
    this.particleSystem.maxLifeTime = 0.2;
    this.particleSystem.updateSpeed = 0.02;*/

    //particleSystem.start();



    this.bindedFire = this.fire.bind(this);
    this.bindedSetCanTakeDammage = this.setCanTakeDammage.bind(this);
}

Player.prototype.reset = function () {
	this.next_cell_col = this.config.map.get_col_from_x(0);
	this.current_cell_col = this.next_cell_col;
	this.next_cell_row = this.config.map.get_row_from_z(0);
	this.current_cell_row = this.next_cell_row;
	this.next_cell = this.config.map.get_index_from_col_row(this.next_cell_col, this.next_cell_row);
	this.current_cell = this.next_cell;
	this.next_map_y = config.map.get_raw_y(this.next_cell) + this.height;
	this.start_pos = new BABYLON.Vector3(0, this.next_map_y, 0);
	this.next_pos = { x: this.start_pos.x, y: this.start_pos.y, z: this.start_pos.z };
	this.current_map_y = this.next_map_y;
	this.dir_z = 0;
	this.dir_x = 0;
	this.force_y = 0;
	this.can_jmp = true;
	this.hp = this.hp_max;
	this.config.map.set_all_cubes_pos(0, 0);
}

Player.prototype.update = function () {
	
	var deltaTime = window.engine.getDeltaTime();

	this.current_map_y = this.next_map_y;
	this.next_map_y = this.config.map.get_raw_y(this.config.map.get_index_from_xz(this.next_pos.x, this.next_pos.z)) + this.height;

	if (this.next_pos.y <= this.next_map_y && Math.abs(this.next_map_y - this.current_map_y) > this.y_step_max) {

		this.next_pos.x = this.camera.position.x;
		this.next_pos.z = this.camera.position.z;
		//this.next_cell_col = this.current_cell_col;
		//this.next_cell_row = this.current_cell_row;
		//this.next_cell = this.current_cell;

	} else {

		this.camera.position.x = this.next_pos.x;
		this.camera.position.z = this.next_pos.z;
		this.camera.position.y = this.next_pos.y;

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

			this.next_pos.y = this.next_map_y;
			//this.camera.position.y = lerp(this.current_map_y, this.next_map_y, );
		}

		var col = this.config.map.get_col_from_x(this.position.x);
		var row = this.config.map.get_row_from_z(this.position.z);

		// new cell
		if (col != this.next_cell_col || row != this.next_cell_row) {
			//console.log("new cell")
			//this.current_map_y = this.next_map_y;
			this.next_cell_col = col;
			this.next_cell_row = row;
			//this.next_cell = this.config.map.get_index_from_col_row(this.next_cell_col, this.next_cell_row);
			//this.next_map_y = this.config.map.get_raw_y(this.next_cell) + this.height;
			//this.next_map_y = this.config.map.get_raw_y(this.config.map.get_index_from_col_row(this.next_cell_col, this.next_cell_row)) + this.height;

			// update de la map visible
			var dir_x = this.next_cell_col - this.current_cell_col;
			var dir_z = this.next_cell_row - this.current_cell_row;

			this.config.map.set_cubes_pos(this.position.x, this.position.z, dir_x, dir_z);

			this.current_cell_col = this.next_cell_col;
			this.current_cell_row = this.next_cell_row;
		}

		//this.current_cell = this.next_cell;
	}

}

Player.prototype.fire = function () {
		//console.log(">>", this.config.map.get_col_from_x(this.camera.position.x), this.config.map.get_row_from_z(this.camera.position.z))
		//console.log(">>>", this.next_cell);
    window.scene.beginAnimation(this.weapon, 0, 100, false, 10, function() {
        //console.log("endAnim");
    });
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

    this.config.healthCircle.fillPercent = Math.max(0, (this.hp/this.hp_max));
    drawCircle(this.config.healthCircle);

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
    window.scene.activeCamera = window.menuCamera;
    drawDeadScreen(this.config.imgs.title, this.config.score);
}

Player.prototype.respawn = function() {
    window.scene.activeCamera = this.camera;
    gunsight.style.visibility = "visible";
    this.reset();
    this.config.score = 0;
    this.config.healthCircle.fillPercent = 1;
    inGameGUI(this.config);
}

