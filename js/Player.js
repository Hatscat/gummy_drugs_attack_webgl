var Player = function(config) {
	
	this.config = config;
	this.startPosition = new BABYLON.Vector3(0, config.y_max + 5, 0);
	this.previous_pos = { x: this.startPosition.x, y: this.startPosition.y, z: this.startPosition.z };
	this.speed = 0.1;
	this.dir_z = 0;
	this.dir_x = 0;
	this.jmp_str = 0.09;
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
    this.camera.ellipsoid = null;
    this.camera.checkCollisions = false;
    this.camera.applyGravity = false;
    this.camera.keysUp = [];
    this.camera.keysDown = [];
    this.camera.keysLeft = [];
    this.camera.keysRight = [];
    this.camera.speed = 0;
    this.camera.inertia = 0;
    this.camera.angularSensibility = 700; // lower is more senesible

    /* --- WEAPON --- */
    this.weapon = this.config.meshes.gun;
    this.weapon.isVisible = true;
    this.weapon.rotationQuaternion = null;
    this.weapon.rotation.x = -Math.PI/2;
    this.weapon.rotation.y = Math.PI;
    this.weapon.parent = this.camera; // The weapon will move with the player camera
    this.weapon.position = new BABYLON.Vector3(0.25,-0.4,1);
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
