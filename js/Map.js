"use strict"
// require tools.js

function Map (config) {
	
	this.config = config;
	this.side_len = Math.pow(2, this.config.map_side_n) + 1;
	this.vals_nb = this.side_len * this.side_len;
	this.cubes_side_len = this.config.map_visibility_n * 2 + 1;
	this.cubes_nb = this.cubes_side_len * this.cubes_side_len;
	this.y_min  = 0;
	this.y_max  = 0xff;
	this.y_half_max = this.y_max * 0.5;
	this.values = new Uint8ClampedArray(this.vals_nb);
	this.half_cube_size = this.config.cube_size * 0.5;
	this.x0 = (1 - this.side_len) * this.half_cube_size;
	this.z0 = (1 - this.side_len) * this.half_cube_size;

	this.create();
}

Map.prototype.create = function () {

	var top_left = 0;
	var top_right = this.side_len - 1;
	var bot_left = this.side_len * (this.side_len - 1);
	var bot_right = this.side_len * this.side_len - 1;

	this.values[top_left] = Math.random() * this.y_max;
	this.values[top_right] = 0;
	this.values[bot_left] = this.y_max;
	this.values[bot_right] = Math.random() * this.y_max;
	
	this.diamond_sqrt(this.side_len);

	var origin_box = BABYLON.Mesh.CreateBox("original", this.config.cube_size, window.scene);
	origin_box.scaling.y = this.y_max / this.config.cube_size;
	origin_box.material = new BABYLON.StandardMaterial("cubeMat", window.scene);
	origin_box.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
	origin_box.material.specularColor = new BABYLON.Color3(0.5, 0, 0);
	origin_box.material.checkReadyOnEveryCall = false;

	//origin_box.material = new BABYLON.ShaderMaterial("ground", scene, "./shaders/ground",
        //{
        //    attributes: ["position", "normal", "uv"],
        //    uniforms: ["world", "worldViewProjection"]
        //});
	
	this.cubes = [];

	for (var i = 0; i < this.cubes_nb; ++i) {
		this.cubes[i] = origin_box.createInstance("box" + i);
	}
	origin_box.setEnabled(false);

/*  // pour visualiser la map généré en image :	
	var px_size = innerHeight / this.side_len | 0;
	var canvas = document.createElement("canvas")
	canvas.width = canvas.height = this.side_len * px_size
	var ctx = canvas.getContext("2d")
	for (var i = 0; i < this.vals_nb; ++i) {
		ctx.fillStyle = 'rgb('+ this.values[i] + ',' + this.values[i] + ',' + this.values[i] + ')'
		ctx.fillRect((i%this.side_len)*px_size, (i/this.side_len|0)*px_size, px_size, px_size)
	}
	document.body.appendChild(canvas)
*/
}

Map.prototype.diamond_sqrt = function (len) {

	if (len === 2) return;
	
	var cols_len = len - 1;
	var half_cols_len = cols_len >> 1;
	var rows_len = this.side_len * cols_len;
	var half_rows_len = rows_len >> 1;
	var subdivs = parseInt(this.side_len / cols_len);
	var sqrts_nb = subdivs * subdivs;
	var noise_len = cols_len * this.config.map_noise_coef;

	// diamond_step, non factorisé
	for (var i = 0; i < sqrts_nb; ++i) {
		var x0 = i % subdivs;
		var y0 = parseInt(i / subdivs);
		var tl = (x0 + y0 * this.side_len) * cols_len;
		var tr = tl + cols_len;
		var bl = tl + rows_len;
		var br = tr + rows_len;
		var center = tl + half_cols_len + half_rows_len;
		
		this.values[center] = average(this.values[tl], this.values[tr], this.values[bl], this.values[br]) + get_noise(noise_len);
	}

	// sqrt_step, non factorisé
	for (var i = 0; i < sqrts_nb; ++i) {
		var x0 = i % subdivs;
		var y0 = parseInt(i / subdivs);
		var tl = (x0 + y0 * this.side_len) * cols_len;
		var tr = tl + cols_len;
		var bl = tl + rows_len;
		var br = tr + rows_len;
		var center = tl + half_cols_len + half_rows_len;

		var top = tl + half_cols_len;
		var right = tr + half_rows_len;
		var bot = bl + half_cols_len;
		var left = tl + half_rows_len;

		var out_top = top - half_rows_len;
		var out_right = right + half_cols_len;
		var out_bot = bot + half_rows_len;
		var out_left = left - half_cols_len;

		if (!this.values[top]) {
			if (out_top > 0) {
				this.values[top] = average(this.values[tl], this.values[tr], this.values[center], this.values[out_top]) + get_noise(noise_len);
			} else {
				this.values[top] = average(this.values[tl], this.values[tr], this.values[center]) + get_noise(noise_len);
			}
		}
		if (!this.values[right]) {
			if (out_right % this.side_len > right % this.side_len) {
				this.values[right] = average(this.values[tr], this.values[br], this.values[center], this.values[out_right]) + get_noise(noise_len);
			} else {
				this.values[right] = average(this.values[tr], this.values[br], this.values[center]) + get_noise(noise_len);
			}
		}
		if (!this.values[bot]) {
			if (out_bot < this.vals_nb) {
				this.values[bot] = average(this.values[bl], this.values[br], this.values[center], this.values[out_bot]) + get_noise(noise_len);
			} else {
				this.values[bot] = average(this.values[bl], this.values[br], this.values[center]) + get_noise(noise_len);
			}
		}
		if (!this.values[left]) {
			if (out_left % this.side_len < left % this.side_len) {
				this.values[left] = average(this.values[tl], this.values[bl], this.values[center], this.values[out_left]) + get_noise(noise_len);
			} else {
				this.values[left] = average(this.values[tl], this.values[bl], this.values[center]) + get_noise(noise_len);
			}
		}
	}

	this.diamond_sqrt(half_cols_len + 1);
}

Map.prototype.set_all_cubes_pos = function (x, z) {
	
	this.moves_x = 0;
	this.moves_z = 0;

	var c0 = this.get_col_from_x(x) - this.config.map_visibility_n;
	var r0 = this.get_row_from_z(z) - this.config.map_visibility_n;

	for (var i = 0; i < this.cubes_nb; ++i) {
		var col = c0 + i % this.cubes_side_len;
		var row = Math.floor(r0 + i / this.cubes_side_len);
		this.cubes[i].col = col;
		this.cubes[i].row = row;
		this.cubes[i].position.x = this.x0 + col * this.config.cube_size;
		this.cubes[i].position.z = this.z0 + row * this.config.cube_size;
		this.cubes[i].position.y = this.get_raw_y(this.get_index_from_col_row(col, row)) - this.y_half_max;
	}
}


Map.prototype.set_cubes_pos = function (x, z, dir_x, dir_z) {
	
	if (dir_x == 1 || dir_x == -1) {
		
		var c = loop_index(dir_x == 1 ? this.moves_x : this.cubes_side_len - 1 + this.moves_x, this.cubes_side_len); 
		var new_col = this.get_col_from_x(x) + this.config.map_visibility_n * dir_x;
		this.moves_x += dir_x;

		for (var i = 0; i < this.cubes_side_len; ++i) {
			var cube_i = i * this.cubes_side_len + c;
			this.cubes[cube_i].col = new_col;
			this.cubes[cube_i].position.x = this.x0 + new_col * this.config.cube_size;
			this.cubes[cube_i].position.y = this.get_raw_y(this.get_index_from_col_row(new_col, this.cubes[cube_i].row)) - this.y_half_max;
		}
	}

	if (dir_z == 1 || dir_z == -1) {

		var r = loop_index(dir_z == 1 ? this.moves_z : this.cubes_side_len - 1 + this.moves_z, this.cubes_side_len) * this.cubes_side_len; 
		var new_row = this.get_row_from_z(z) + this.config.map_visibility_n * dir_z;
		this.moves_z += dir_z;

		for (var i = 0; i < this.cubes_side_len; ++i) {
			var cube_i = i + r;
			this.cubes[cube_i].row = new_row;
			this.cubes[cube_i].position.z = this.z0 + new_row * this.config.cube_size;
			this.cubes[cube_i].position.y = this.get_raw_y(this.get_index_from_col_row(this.cubes[cube_i].col, new_row)) - this.y_half_max;
		}
	}
}

Map.prototype.get_raw_y = function (cell_index) {
	return this.values[cell_index] * this.config.cube_height;
}

Map.prototype.get_smooth_y_from_xz = function (x, z) {
	var c = (x - this.x0 + this.half_cube_size) / this.config.cube_size;
	var r = (z - this.z0 + this.half_cube_size) / this.config.cube_size;
	var fc = Math.abs(c % 1);
	var fr = Math.abs(r % 1);
	//var c0, c1, r0, r1;
	/*
	if (fc < 0.5) {
		c0 = Math.floor(c);
		c1 = Math.ceil(c);
	} else {
		c0 = 
		c1 = Math.floor(0);
	}
	*/
	var c0 = Math.floor(c);
	var c1 = c0 + (fc < 0.5 ? -1 : 1) * sign(c);
	var r0 = Math.floor(r);
	var r1 = r0 + (fr < 0.5 ? -1 : 1) * sign(r);
	var val0 = this.get_raw_y(this.get_index_from_col_row(c0, r0));
	var val1 = this.get_raw_y(this.get_index_from_col_row(c0, r1));
	var val2 = this.get_raw_y(this.get_index_from_col_row(c1, r0));
	var val3 = this.get_raw_y(this.get_index_from_col_row(c1, r1));
	var lc = lerp(val0, val2, fc);
	var lr = lerp(val1, val3, fr);

	return lerp( lc, lr, fc / fr );
}

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

function get_noise (len) {
	return Math.random() * (len + 1) - (len >> 1);
}

