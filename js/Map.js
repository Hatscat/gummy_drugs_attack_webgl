"use strict"

function Map (config) {
	
	this.config = config;
	this.side_len = Math.pow(2, config.map_side_n) + 1;
	//this.half_side_len = this.side_len >> 1;
	this.vals_nb = this.side_len * this.side_len;
	this.y_min  = 0x100;
	this.y_max  = 0;
	//this.values = new Int16Array(this.vals_nb);
	this.values = new Uint8ClampedArray(this.vals_nb);
	this.half_cube_size = this.config.cube_size * 0.5;
	this.x0 = (1 - this.side_len) * this.half_cube_size;
	this.z0 = (1 - this.side_len) * this.half_cube_size;

	this.reset();
}

Map.prototype.reset = function () {

	/*
	var color_0 = [Math.random(), Math.random(), Math.random()];
	var color_1 = [Math.random(), Math.random(), Math.random()];
	var specular_0 = [Math.random(), Math.random(), Math.random()];
	var specular_1 = [Math.random(), Math.random(), Math.random()];
	*/
	var top_left = 0;
	var top_right = this.side_len - 1;
	var bot_left = this.side_len * (this.side_len - 1);
	var bot_right = this.side_len * this.side_len - 1;

	var y_max = this.side_len * this.config.cube_size * 0.3;
	this.values[top_left] = Math.random() * y_max;
	this.values[top_right] = Math.random() * y_max;
	this.values[bot_left] = Math.random() * y_max;
	this.values[bot_right] = Math.random() * y_max;
	
	this.diamond_sqrt(top_left, top_right, bot_left, bot_right);

	var origin_box = BABYLON.Mesh.CreateBox("original", this.config.cube_size, window.scene);
	origin_box.scaling.y = this.side_len;
	origin_box.position.x = this.x0;
	origin_box.position.z = this.z0;
	origin_box.position.y = this.values[0];
	origin_box.material = new BABYLON.StandardMaterial("cubeMat", window.scene);
	origin_box.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
	origin_box.material.specularColor = new BABYLON.Color3(0.5, 0, 0);
	origin_box.material.checkReadyOnEveryCall = false;

	//origin_box.material.diffuseTexture = new BABYLON.BrickProceduralTexture("texture", 1024, window.scene);
	
	//origin_box.material = new BABYLON.ShaderMaterial("ground", scene, "./shaders/ground",
        //{
        //    attributes: ["position", "normal", "uv"],
        //    uniforms: ["world", "worldViewProjection"]
        //});
	
	var cubes = [origin_box];

	for (var i = this.vals_nb; i--;) {
		var clone = origin_box.clone("box" + i, null, true);
		clone.position.x += this._get_col_from_index(i) * this.config.cube_size;
		clone.position.z += this._get_row_from_index(i) * this.config.cube_size;
		clone.position.y = this.values[i];

		cubes[i] = clone;
	}
	origin_box.setEnabled(false);
	this.config.ground = BABYLON.Mesh.MergeMeshes(cubes, true);
	//window.scene.createOrUpdateSelectionOctree();

/*
	var buffer = new Uint8ClampedArray(this.vals_nb << 2);

	for (var i = 0; i < this.vals_nb; ++i) {
		
		var ii = i << 2;
		
		buffer[ii] = buffer[ii+1] = buffer[ii+2] = this.values[i];
		buffer[ii+3] = 0xff;

		if (this.values[i] < this.y_min) this.y_min = this.values[i];
		if (this.values[i] > this.y_max) this.y_max = this.values[i];
	}

	console.log("y min:",this.y_min)
	console.log("y max:",this.y_max)

	this.config.ground = new BABYLON.GroundMesh("ground", window.scene);

	this.config.ground._subdivisions = 400;
	this.config.ground._setReady(false);

	var vertex_data = BABYLON.VertexData.CreateGroundFromHeightMap(this.side_len * this.config.cube_size, this.side_len * this.config.cube_size, 400, 0, 255, buffer, this.side_len, this.side_len);
	this.config.ground.rotation.y = Math.PI;
	//this.config.ground.rotation.y = -this.config.half_PI;
	vertex_data.applyToMesh(this.config.ground, false);
	this.config.ground._setReady(true);
*/
}

Map.prototype.diamond_sqrt = function (tl, tr, bl, br) {
	
	var half_len = (tr - tl) >> 1;
	
	var center = tl + (this.side_len + 1) * half_len;
	var top = tl + half_len;
	var right = tr + this.side_len * half_len;
	var bot = bl + half_len;
	var left = tl + this.side_len * half_len;

	this.values[center] = ((this.values[tl] + this.values[tr] + this.values[bl] + this.values[br] + 0.5) >> 2) + get_noise_1();
	this.values[top] = ((this.values[tl] + this.values[tr] + this.values[center]) / 3 + 0.5 | 0) + get_noise_1();
	this.values[right] = ((this.values[tr] + this.values[br] + this.values[center]) / 3  + 0.5 | 0) + get_noise_1();
	this.values[bot] = ((this.values[bl] + this.values[br] + this.values[center]) / 3 + 0.5 | 0) + get_noise_1();
	this.values[left] = ((this.values[tl] + this.values[bl] + this.values[center]) / 3 + 0.5 | 0) + get_noise_1();

	if (half_len > 1) {
		this.diamond_sqrt(tl, top, left, center);
		this.diamond_sqrt(top, tr, center, right);
		this.diamond_sqrt(left, center, bl, bot);
		this.diamond_sqrt(center, right, bot, br);
	}
}

Map.prototype.get_raw_y = function (cell_index) {
	return this.values[cell_index] + (this.config.cube_size * this.side_len >> 1);
}

/*
Map.prototype.get_smooth_y = function (x, z) {
	return undefined;
}
*/

Map.prototype.get_index_from_xz = function (x, z) {
	return this._get_index_from_col_row(this._get_col_from_x(x), this._get_row_from_z(z));
}

Map.prototype.get_yoyo_index_col_row = function (col, row) {
	col = this._get_yoyo_col_or_row(col);
	row = this._get_yoyo_col_or_row(row);
	return this._get_index_from_col_row(col, row);
}

Map.prototype.is_in_map = function (x, z) {
	return x > this.x0 - this.half_cube_size && x < this.half_cube_size - this.x0 && z > this.z0 - this.half_cube_size && z < this.half_cube_size - this.z0;
}

Map.prototype._get_yoyo_col_or_row = function (axis) {
	return this.side_len - Math.abs( this.side_len - Math.abs(axis % (this.side_len << 1)) );
}

Map.prototype._get_index_from_col_row = function (col, row) {
	return col + row * this.side_len;
}

Map.prototype._get_col_from_index = function (index) {
	return index % this.side_len;
}

Map.prototype._get_row_from_index = function (index) {
	return index / this.side_len | 0;
}

Map.prototype._get_col_from_x = function (x) {
	return (x - this.x0 + this.half_cube_size) / this.config.cube_size | 0;
}

Map.prototype._get_row_from_z = function (z) {
	return (z - this.z0 + this.half_cube_size) / this.config.cube_size | 0;
}

function get_noise_1 () {
	return Math.random() < 0.5 ? 1 : -1;
}

