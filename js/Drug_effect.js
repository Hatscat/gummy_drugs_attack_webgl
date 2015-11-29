"use strict"

function Drug_effect (config) {

	this.config = config;
	this.drug_lvl_max = 8;
	this.increase_duration = 1;
	this.decrease_duration = 4;
	this.post_process = new BABYLON.PostProcess("drug", "./shaders/drug", ["resolution", "time", "drug_lvl"], null, 1, null, BABYLON.Texture.BILINEAR_SAMPLINGMODE, window.engine, true);

	this.reset();

	this.post_process.onApply = this.update.bind(this);
}

Drug_effect.prototype.reset = function () {
	
	this.drug_lvl = 0;
	this.target_drug_lvl = 0;
	this.drug_ratio = 0;
	this.time = 0;
}

Drug_effect.prototype.add = function () {
	if (this.target_drug_lvl < this.drug_lvl_max) {
		this.target_drug_lvl = Math.min( this.drug_lvl_max, Math.max( this.target_drug_lvl + 1, Math.floor(this.drug_lvl + 1.5) ) );
	}
}

Drug_effect.prototype.update = function (effect) {

	var delta_time = window.engine.deltaTime * 0.001;
	
	this.time = (this.time + delta_time) % 0x7fffffff;
	
	if (this.drug_lvl < this.target_drug_lvl) {
		this.drug_lvl += delta_time / this.increase_duration;
	} else if (this.drug_lvl > 0) {
		this.drug_lvl = Math.max( 0, this.drug_lvl - (delta_time / this.decrease_duration) );
		this.target_drug_lvl = this.drug_lvl | 0;
	}

	this.drug_ratio = this.drug_lvl / this.drug_lvl_max;
	
	// post processing
	effect.setFloat2("resolution", window.render_canvas.width, window.render_canvas.height);
	effect.setFloat("time", this.time);
	effect.setFloat("drug_lvl", this.drug_ratio);
}

