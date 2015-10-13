var Player = function (config) {
	
	this.config = config;

	this.hp_max = 100;
	this.height = 3;
	this.speed = 0.016;
	this.jmp_str = 0.05;
	this.y_step_max = 1;
	
	this.reset();

    /* --- CAMERA --- */
    this.camera = new BABYLON.FreeCamera("camera", this.start_pos, window.scene); // change with a simpler camera

    this.camera.attachControl(render_canvas);
    this.camera.fov = 90;
    this.camera.minZ = 0.001;
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

    /* --- WEAPON --- */
    this.weapon = this.config.meshes.gun;
    this.weapon.isVisible = true;
    this.weapon.parent = this.camera; // The weapon will move with the player camera
    this.weapon.material = new BABYLON.StandardMaterial("weaponMat", window.scene);
    this.weapon.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    this.weapon.material.specularColor = new BABYLON.Color3(0.5, 1, 0.5);
    //this.weapon.material.wireframe = true;
    this.weapon.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
    this.weapon.position = new BABYLON.Vector3(0.02, -0.035, 0.02);

    var endRotation = this.weapon.rotation.clone();
    endRotation.x -= Math.PI / 12;
    var display = new BABYLON.Animation("fire", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var animKeys = [
        {
            frame: 0,
            value: this.weapon.rotation
        },
        {
            frame: 10,
            value: endRotation
        },
        {
            frame: 100,
            value: this.weapon.rotation
        }
    ];
    display.setKeys(animKeys);
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
}

Player.prototype.reset = function () {
	this.current_cell = this.config.map.get_index_from_xz(0, 0);
	this.current_map_y = config.map.get_raw_y(this.current_cell) + this.height;
	this.start_pos = new BABYLON.Vector3(0, this.current_map_y, 0);
	this.next_pos = { x: this.start_pos.x, y: this.start_pos.y, z: this.start_pos.z };
	//this.previous_cell = 0;
	this.previous_map_y = this.current_map_y;
	this.dir_z = 0;
	this.dir_x = 0;
	this.force_y = 0;
	this.can_jmp = true;
	this.hp = this.hp_max;
}

Player.prototype.update = function () {
	
	var deltaTime = window.engine.getDeltaTime();
	//this.previous_cell = this.current_cell;
	var cell = this.config.map.get_index_from_xz(this.next_pos.x, this.next_pos.z);
	
	this.previous_map_y = this.current_map_y;

	if (this.current_cell != cell) {
		//this.previous_map_y = this.current_map_y;
		this.current_cell = cell;
		this.current_map_y = this.config.map.get_raw_y(this.current_cell) + this.height;
	}
	
	if (	!this.config.map.is_in_map(this.next_pos.x, this.next_pos.z) // limites de la map
		|| (this.next_pos.y <= this.current_map_y && Math.abs(this.current_map_y - this.previous_map_y) > this.y_step_max) ) {

		this.next_pos.x = this.camera.position.x;
		this.next_pos.z = this.camera.position.z;
		this.next_pos.y = this.camera.position.y;
		//this.dir_x = this.dir_z = 0;

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
		if (this.next_pos.y <= this.current_map_y) {

			this.force_y = 0;
			this.can_jmp = true;

			this.next_pos.y = this.current_map_y;
			//this.camera.position.y = lerp(this.previous_map_y, this.current_map_y, );
		}

	}

}

Player.prototype.fire = function () {
    window.scene.beginAnimation(this.weapon, 0, 100, false, 10, function() {
        //console.log("endAnim");
    });
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

