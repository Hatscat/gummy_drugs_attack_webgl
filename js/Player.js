var Player = function(keyBindings) {
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

    this.camera.keysUp = keyBindings.forward;
    this.camera.keysDown = keyBindings.backward;
    this.camera.keysLeft = keyBindings.left;
    this.camera.keysRight = keyBindings.right;

    this.camera.speed = this.speed;
    this.camera.inertia = this.inertia;
    this.camera.angularSensibility = this.angularSensibility;
}