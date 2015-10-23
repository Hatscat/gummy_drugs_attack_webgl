ParticlesManager = function(config) {
	this.impactParticlesSystem = [];

	this.impactConfig = {
		particlesNb: 10,
		particleTexture: config.textures.gunImpactParticle,
		minSize: 0.08,
		maxSize: 0.13,
		minLifeTime: 0.04,
		maxLifeTime: 0.06,
		minEmitBox: new BABYLON.Vector3(0, 0, 0),
		maxEmitBox: new BABYLON.Vector3(0, 0, 0),
		targetStopDuration: 0.05,
		emitRate: 1500,
		direction1: new BABYLON.Vector3(-10, -10, -10),
		direction2: new BABYLON.Vector3(10, 10, 10),
		minAngularSpeed: 0,
		maxAngularSpeed: 2*Math.PI,
		updateSpeed: 0.005,
	}
}

            
ParticlesManager.prototype.impactLaunch = function(pos) {
	for(var i=0; i<this.impactParticlesSystem.length; i++) {
		if(!this.impactParticlesSystem[i].isStarted()) {
			this.impactParticlesSystem[i].emitter = pos;
			this.impactParticlesSystem[i].start();
			return;
		}
	}
	this.impactParticlesSystem.push( this.createParticleSystem(this.impactConfig) );
	this.impactParticlesSystem[i].emitter = pos;
	this.impactParticlesSystem[i].color1 = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), 300);
	this.impactParticlesSystem[i].color2 = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), 300);
	this.impactParticlesSystem[this.impactParticlesSystem.length-1].start();
}

ParticlesManager.prototype.createParticleSystem = function(systemConfig) {
	var emitter = new BABYLON.Vector3(0,0,0);
	var particleSystem = new BABYLON.ParticleSystem("particles", systemConfig.particlesNb, window.scene);
	particleSystem.emitter = emitter;

	for(var i in systemConfig) {
		if(i == "particlesNb") {
			continue;
		}

		particleSystem[i] = systemConfig[i];
	}

	return particleSystem;
}