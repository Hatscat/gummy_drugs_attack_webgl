var Player = function(config) {
    this.height = 2;
    this.speed = 1;
    this.inertia = 0.9; 
    this.angularSensibility = 1000; // lower is more senesible
    this.startPosition = new BABYLON.Vector3(0,5,0);

    this.camera = new BABYLON.FreeCamera("camera", this.startPosition, window.scene);

    this.camera.attachControl(render_canvas);
    this.camera.ellipsoid = new BABYLON.Vector3(2, this.height, 2);
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;

    this.camera.keysUp = config.keyBindings.forward;
    this.camera.keysDown = config.keyBindings.backward;
    this.camera.keysLeft = config.keyBindings.left;
    this.camera.keysRight = config.keyBindings.right;

    this.camera.speed = this.speed;
    this.camera.inertia = this.inertia;
    this.camera.angularSensibility = this.angularSensibility;

    this.weapon = config.meshes.gun;
    this.weapon.isVisible = true;
    this.weapon.rotationQuaternion = null;
    this.weapon.rotation.x = -Math.PI/2;
    this.weapon.rotation.y = Math.PI;
    this.weapon.parent = this.camera; // The weapon will move with the player camera
    this.weapon.position = new BABYLON.Vector3(0.25,-0.4,1);
}