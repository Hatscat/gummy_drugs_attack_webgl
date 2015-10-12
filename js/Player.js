var Player = function(config) {
	
	this.config = config;
	this.startPosition = new BABYLON.Vector3(0, config.y_max + 5, 0);
	this.previous_pos = { x: this.startPosition.x, y: this.startPosition.y, z: this.startPosition.z };
	this.speed = 0.1;
	this.dir_z = 0;
	this.dir_x = 0;
	this.jmp_str = 0.1;
	this.force_y = 0;
	this.can_jmp = true;
	
	/* --- SPHERE COLLIDER --- */
	this.sphere = BABYLON.Mesh.CreateSphere("collider", 16, 8, window.scene);
	this.sphere.checkCollisions = true;
	this.sphere.position.x = this.startPosition.x;
	this.sphere.position.y = this.startPosition.y;
	this.sphere.position.z = this.startPosition.z;

    /* --- CAMERA --- */
    this.camera = new BABYLON.FreeCamera("camera", this.startPosition, window.scene); // change with a simpler camera

    this.camera.attachControl(render_canvas);
    this.camera.fov = 90;
    this.camera.minZ = 0.1;
    this.camera.ellipsoid = null;
    this.camera.checkCollisions = false;
    this.camera.applyGravity = false;
    this.camera.keysUp = [];
    this.camera.keysDown = [];
    this.camera.keysLeft = [];
    this.camera.keysRight = [];
    this.camera.speed = 0;
    this.camera.inertia = 0;
    this.camera.angularSensibility = 1000; // lower is more senesible

    /* --- WEAPON --- */
    this.weapon = this.config.meshes.gun;
    this.weapon.isVisible = true;
    this.weapon.parent = this.camera; // The weapon will move with the player camera
    this.weapon.material = new BABYLON.StandardMaterial("weaponMat", window.scene);
    this.weapon.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    this.weapon.material.specularColor = new BABYLON.Color3(0.5, 1, 0.5);
    //this.weapon.material.wireframe = true;
    this.weapon.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    this.weapon.position = new BABYLON.Vector3(0.2, -0.35, 0.2);

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

Player.prototype.fire = function() {
    window.scene.beginAnimation(this.weapon, 0, 100, false, 10, function() {
        console.log("endAnim");
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
