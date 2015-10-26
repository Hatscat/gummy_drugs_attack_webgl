var DrugPillsManager = function() {
	this.config = config;

	this.drugs = {};
	this.drugsMaterials = [];
	this.drugsMaterialsNb = 10;
	this.drugsNameCount = 0;
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
	this.drugsNameCount++;
}

DrugPillsManager.prototype.updateDrugs = function(deltaTime) {
	this.config.player.drugToEat = null;
	for(var i in this.drugs) {
		var isUpdateNormal = this.drugs[i].update(deltaTime); // if the drugs needs to be removed, its update returns false
		if(!isUpdateNormal) {
			this.deleteDrug(i);
		}
	}
}

DrugPillsManager.prototype.deleteDrug = function(name) {
	this.drugs[name].mesh.dispose();
	delete this.drugs[name]; // remove key i from structure
}