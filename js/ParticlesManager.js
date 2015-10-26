ParticlesManager = function(config) {
	this.particlesSytems = {
		impact: {
			config: {
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
				color1: 'random',
				color2: 'random',
			},

			arr: []
		},

		AIDeath: {
			config: {
				particlesNb: 3000,
				particleTexture: config.textures.gunImpactParticle,
				minSize: 0.10,
				maxSize: 0.15,
				minLifeTime: 0.08,
				maxLifeTime: 0.10,
				minEmitBox: new BABYLON.Vector3(0, 0, 0),
				maxEmitBox: new BABYLON.Vector3(0, 0, 0),
				targetStopDuration: 0.09,
				emitRate: 9000,
				direction1: new BABYLON.Vector3(-10, -10, -10),
				direction2: new BABYLON.Vector3(10, 10, 10),
				minAngularSpeed: 0,
				maxAngularSpeed: 2*Math.PI,
				updateSpeed: 0.010,
				color1: new BABYLON.Color4(1, 0, 0, 300),
				color2: new BABYLON.Color4(1, 0, 0, 300),
			},

			arr: []
		}
	}
}

            
ParticlesManager.prototype.launch = function(systemName, pos) {
	var particlesArr = this.particlesSytems[systemName].arr;
	for(var i=0; i<particlesArr.length; i++) {
		if(!particlesArr[i].isStarted()) {
			particlesArr[i].emitter = pos;
			particlesArr[i].start();
			return;
		}
	}
	particlesArr.push(this.createParticleSystem(this.particlesSytems[systemName].config));
	particlesArr[i].emitter = pos;
	particlesArr[particlesArr.length-1].start();
}

ParticlesManager.prototype.createParticleSystem = function(systemConfig) {
	var emitter = new BABYLON.Vector3(0,0,0);
	var particleSystem = new BABYLON.ParticleSystem("particles", systemConfig.particlesNb, window.scene);
	particleSystem.emitter = emitter;

	for(var i in systemConfig) {
		if(i == "particlesNb") {
			continue;
		}
		if(i.indexOf("color") != -1 && systemConfig[i] == "random") {
			particleSystem[i] = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), 300);
			continue;
		}

		particleSystem[i] = systemConfig[i];
	}

	return particleSystem;
}
