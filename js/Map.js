"use strict"

function Map (config) {
	
	this.config = config;
	this.side_len = Math.pow(2, this.config.map_side_n) + 1;
	//this.half_side_len = this.side_len >> 1;
	this.vals_nb = this.side_len * this.side_len;
	this.cubes_side_len = Math.pow(2, this.config.map_visibility_n) + 1;
	this.cubes_nb = this.cubes_side_len * this.cubes_side_len;
	this.y_min  = 0;
	this.y_max  = 0xff;
	this.y_half_max = this.y_max * 0.5;
	this.values = new Uint8ClampedArray(this.vals_nb);
	this.half_cube_size = this.config.cube_size * 0.5;
	this.x0 = (1 - this.side_len) * this.half_cube_size;
	this.z0 = (1 - this.side_len) * this.half_cube_size;

	this.reset();
}

Map.prototype.reset = function () {

	var top_left = 0;
	var top_right = this.side_len - 1;
	var bot_left = this.side_len * (this.side_len - 1);
	var bot_right = this.side_len * this.side_len - 1;

	var y_max = this.side_len * this.config.cube_size * 0.3;
	//var y_max = this.y_max + 1;
	this.values[top_left] = Math.random() * y_max;
	this.values[top_right] = Math.random() * y_max;
	this.values[bot_left] = Math.random() * y_max;
	this.values[bot_right] = Math.random() * y_max;
	
	this.diamond_sqrt(top_left, top_right, bot_left, bot_right);

	var origin_box = BABYLON.Mesh.CreateBox("original", this.config.cube_size, window.scene);
	origin_box.scaling.y = this.y_max / this.config.cube_size;
	origin_box.material = new BABYLON.StandardMaterial("cubeMat", window.scene);
	origin_box.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
	origin_box.material.specularColor = new BABYLON.Color3(0.5, 0, 0);
	//origin_box.material.checkReadyOnEveryCall = false;

	//origin_box.material = new BABYLON.ShaderMaterial("ground", scene, "./shaders/ground",
        //{
        //    attributes: ["position", "normal", "uv"],
        //    uniforms: ["world", "worldViewProjection"]
        //});
	
	this.cubes = [];

	for (var i = 0; i < this.cubes_nb; ++i) {
		this.cubes[i] = origin_box.clone("box" + i, null, true);
	}
	origin_box.setEnabled(false);

	this.set_all_cubes_pos(0, 0);
	//this.config.ground = BABYLON.Mesh.MergeMeshes(cubes, true);
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

Map.prototype.set_all_cubes_pos = function (x, z) {
	
	this.moves_x = 0;
	this.moves_z = 0;

	var c0 = this.get_col_from_x(x) - this.config.map_visibility_n;
	var r0 = this.get_row_from_z(z) - this.config.map_visibility_n;

	console.log(c0, r0)
	console.log("#############")

	for (var i = 0; i < this.cubes_nb; ++i) {
		
		var col = c0 + i % this.cubes_side_len;
		var row = Math.floor(r0 + i / this.cubes_side_len);
		this.cubes[i].col = col;
		this.cubes[i].row = row;
		
		console.log(col, row)

		this.cubes[i].position.x = this.x0 + col * this.config.cube_size;
		this.cubes[i].position.z = this.z0 + row * this.config.cube_size;

		console.log("-------------")
		console.log(this.cubes[i].position.x, this.cubes[i].position.z)
		console.log("-------------")

		this.cubes[i].position.y = this.values[this.get_index_from_col_row(col, row)] - this.y_half_max;
		console.log("-------------")
		console.log(this.cubes[i].position.y)
	}
}


Map.prototype.set_cubes_pos = function (x, z, dir_x, dir_z) {
	
	if (dir_x == 1 || dir_x == -1) {
		
		var c = loop_index(dir_x == 1 ? this.moves_x : this.cubes_side_len - 1 + this.moves_x, this.cubes_side_len); 
		//console.log(c)
		var new_col = this.get_col_from_x(x) + this.config.map_visibility_n * dir_x;
		this.moves_x += dir_x;

		for (var i = 0; i < this.cubes_side_len; ++i) {
			var cube_i = i * this.cubes_side_len + c;
			this.cubes[cube_i].col = new_col;
			this.cubes[cube_i].position.x = this.x0 + new_col * this.config.cube_size;
			this.cubes[cube_i].position.y = this.values[this.get_index_from_col_row(new_col, this.cubes[i].row)] - this.y_half_max;
		}
	}

	if (dir_z == 1 || dir_z == -1) {

		var r = loop_index(dir_z == 1 ? this.moves_z : this.cubes_side_len - 1 + this.moves_z, this.cubes_side_len) * this.cubes_side_len; 
		//console.log(r)
		var new_row = this.get_row_from_z(z) + this.config.map_visibility_n * dir_z;
		this.moves_z += dir_z;

		for (var i = 0; i < this.cubes_side_len; ++i) {
			var cube_i = i + r;
			this.cubes[cube_i].row = new_row;
			this.cubes[cube_i].position.z = this.z0 + new_row * this.config.cube_size;
			this.cubes[cube_i].position.y = this.values[this.get_index_from_col_row(this.cubes[i].col, new_row)] - this.y_half_max;
		}
	}
}

Map.prototype.get_raw_y = function (cell_index) {
	return this.values[cell_index];
}

/*
Map.prototype.get_smooth_y = function (x, z) {
	return undefined;
}
*/

Map.prototype.get_index_from_xz = function (x, z) {
	return this.get_index_from_col_row(this.get_col_from_x(x), this.get_row_from_z(z));
}

Map.prototype.is_in_map = function (x, z) {
	return x > this.x0 - this.half_cube_size && x < this.half_cube_size - this.x0 && z > this.z0 - this.half_cube_size && z < this.half_cube_size - this.z0;
}

Map.prototype.get_yoyo_axis = function (axis) {
	var max = this.side_len - 1;
	return max - Math.abs( max - Math.abs(axis % (max << 1)) );
}

Map.prototype.get_index_from_col_row = function (col, row) {
	return this.get_yoyo_axis(col) + this.get_yoyo_axis(row) * this.side_len;
}

Map.prototype.get_col_from_index = function (index) {
	return index % this.side_len;
}

Map.prototype.get_row_from_index = function (index) {
	return index / this.side_len | 0;
}

Map.prototype.get_col_from_x = function (x) {
	return Math.floor((x - this.x0 + this.half_cube_size) / this.config.cube_size);
}

Map.prototype.get_row_from_z = function (z) {
	return Math.floor((z - this.z0 + this.half_cube_size) / this.config.cube_size);
}

function loop_index (index, length) {
	return (length + (index % length)) % length;
}

function get_noise_1 () {
	return Math.random() < 0.5 ? 1 : -1;
}

