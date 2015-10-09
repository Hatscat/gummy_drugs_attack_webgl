var Player = function(config) {
    this.height = 2;
    this.speed = 1;
    this.inertia = 0.9; 
    this.angularSensibility = 1000; // lower is more senesible
    this.startPosition = new BABYLON.Vector3(0,5,0);

    this.camera = new BABYLON.FreeCamera("camera", this.startPosition, window.scene);

    this.camera.attachControl(render_canvas);
    this.camera.ellipsoid = new BABYLON.Vector3(2, this.height, 2);
    //this.camera.checkCollisions = true;
    //this.camera.applyGravity = true;

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

    var endRotation = this.weapon.rotation.clone();
    endRotation.x += Math.PI/12;
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
