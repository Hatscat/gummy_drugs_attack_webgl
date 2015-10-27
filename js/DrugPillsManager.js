"use strict"

var DrugPillsManager = function (config) {
	this.config = config;

	this.drugs = {};
	this.drugsMaterials = [];
	this.drugsMaterialsNb = 10;
	this.drugsNameCount = 0;
	this.yum_timer_max = 1000;
	this.yum_timer = 0;

	config.meshes.drug = BABYLON.Mesh.CreateSphere("sphere", 10.0, 1.0, window.scene);
	config.meshes.drug.setEnabled(false);

	this.createMaterials();
}

DrugPillsManager.prototype.createMaterials = function() {
	for(var i=0; i<this.drugsMaterialsNb; i++) {
		var materialSphere = new BABYLON.StandardMaterial("texture", window.scene);
		materialSphere.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
		this.drugsMaterials.push(materialSphere);
	}
}

DrugPillsManager.prototype.spawnDrug = function(x,z) {
	var name = "drug" + this.drugsNameCount;
	this.drugs[name] = new DrugPill(this.config, x, z, name);
	++this.drugsNameCount;
}

DrugPillsManager.prototype.updateDrugs = function(deltaTime) {
	for( var i in this.drugs) {
		if (!this.drugs[i].update(deltaTime)) { // if the drugs needs to be removed, its update returns false
			this.drugs[i].force_y -= this.config.gravity * deltaTime;
			this.drugs[i].mesh.position.y += this.drugs[i].force_y;
			if (this.drugs[i].mesh.position.y < this.drugs[i].y_limit) {
				this.deleteDrug(i);
			}
		}
	}
}

DrugPillsManager.prototype.deleteDrug = function(name) {
	this.drugs[name].mesh.dispose();
	delete this.drugs[name]; // remove key i from structure
}
