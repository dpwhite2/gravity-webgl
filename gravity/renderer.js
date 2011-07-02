
//============================================================================//
function StarsRenderer() {
    this._init_shaders();
    this._init_buffers();
    this.positions = [];
    this.sizes = [];
    this.colors = [];
}

StarsRenderer.prototype._init_buffers = function() {
    this.pos_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pos_buffer);

    this.size_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.size_buffer);

    this.color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
}

StarsRenderer.prototype._init_shaders = function() {
    var fragmentShader = get_shader_js(gl, "shader_fs_text");
    var vertexShader = get_shader_js(gl, "shader_vs_text");

    // Create the shader program
    this.shaderprog = gl.createProgram();
    gl.attachShader(this.shaderprog, vertexShader);
    gl.attachShader(this.shaderprog, fragmentShader);
    gl.linkProgram(this.shaderprog);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(this.shaderprog, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    gl.useProgram(this.shaderprog);

    this.star_pos_attr = gl.getAttribLocation(this.shaderprog, "aStarPosition");
    this.star_color_attr = gl.getAttribLocation(this.shaderprog, "aStarColor");
    this.star_size_attr = gl.getAttribLocation(this.shaderprog, "aStarSize");
}

StarsRenderer.prototype.calc_color = function(r) {
    if (r < 2.0) {
        return [1.0, 0.5, 0.5];
    } 
    else if (r < 10.) {
        var p = (r-2.0) / (2*(10.0-2.0)) + 0.5;
        return [1.0, p*1.0, 0.5];
    } 
    else if (r < 21.) {
        var p = (r-10.) / (2*(21.-10.)) + 0.5;
        return [1.0, 1.0, p*1.0];
    } 
    else if (r < 46.) {
        //var p = (46.) / (46.);
        return [0.9, 0.9, 1.0];
    } 
    else {
        return [0.8, 0.8, 1.0];
    }
}

StarsRenderer.prototype.update_buffers = function(sim, cam) {
    this.positions = [];
    this.sizes = [];
    this.colors = [];
    for (var i=0; i<sim.size(); i++) {
        var star = sim.stars[i];
        this.positions.splice(this.positions.length, 0, star.pos.elements[0], star.pos.elements[1], 0.0);
        this.sizes.splice(this.sizes.length, 0, Math.max(star.r/cam.get_zoom(), 1.0));
        var c = this.calc_color(star.r);
        this.colors.splice(this.colors.length, 0, c[0], c[1], c[2], 1.0);
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pos_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.size_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.sizes), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
}

StarsRenderer.prototype.draw_stars = function(sim, cam) {
    gl.useProgram(this.shaderprog);
    gl.enableVertexAttribArray(this.star_pos_attr);
    gl.enableVertexAttribArray(this.star_color_attr);
    gl.enableVertexAttribArray(this.star_size_attr);
    
    this.update_buffers(sim, cam);
    
    var perspective_matrix = cam.perspective_matrix();
    var mvMatrix = cam.translation_matrix();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
    gl.vertexAttribPointer(this.star_color_attr, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pos_buffer);
    gl.vertexAttribPointer(this.star_pos_attr, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.size_buffer);
    gl.vertexAttribPointer(this.star_size_attr, 1, gl.FLOAT, false, 0, 0);
    
    setMatrixUniforms(perspective_matrix, mvMatrix, this.shaderprog);
    gl.drawArrays(gl.POINTS, 0, sim.size());
}

//============================================================================//
function TrailsRenderer() {
    this._init_shaders();
    this._init_buffers();
    this.histories = [];
    this.colors = [];
}

TrailsRenderer.prototype._init_buffers = function() {
    this.history_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.history_buffer);

    this.color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
}

TrailsRenderer.prototype._init_shaders = function() {
    var fragmentShader = get_shader_js(gl, "trails_shader_fs_text");
    var vertexShader = get_shader_js(gl, "trails_shader_vs_text");

    // Create the shader program
    this.shaderprog = gl.createProgram();
    gl.attachShader(this.shaderprog, vertexShader);
    gl.attachShader(this.shaderprog, fragmentShader);
    gl.linkProgram(this.shaderprog);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(this.shaderprog, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    gl.useProgram(this.shaderprog);

    this.star_history_attr = gl.getAttribLocation(this.shaderprog, "aStarPosition");
    this.star_color_attr = gl.getAttribLocation(this.shaderprog, "aStarColor");
}

TrailsRenderer.prototype.calc_color = function(r) {
    if (r < 2.0) {
        return [1.0, 0.5, 0.5];
    } 
    else if (r < 10.) {
        var p = (r-2.0) / (2*(10.0-2.0)) + 0.5;
        return [1.0, p*1.0, 0.5];
    } 
    else if (r < 21.) {
        var p = (r-10.) / (2*(21.-10.)) + 0.5;
        return [1.0, 1.0, p*1.0];
    } 
    else if (r < 46.) {
        //var p = (46.) / (46.);
        return [0.9, 0.9, 1.0];
    } 
    else {
        return [0.8, 0.8, 1.0];
    }
}

TrailsRenderer.prototype.prepare_star_buffer = function(sim, cam) {
    var histories = [];
    var colors = [];
    var indexes = [];
    for (var k=0; k<sim.size(); k++) {
        var star = sim.stars[k];
        var color = this.calc_color(star.r);
        indexes.push(histories.length/3);
        for (var i=0; i<star.history.length; i++) {
            var pos = star.history[i];
            histories.splice(histories.length, 0, pos.elements[0], pos.elements[1], 0.0);
            colors.splice(colors.length, 0, color[0], color[1], color[2], 1.0);
        }
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.history_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(histories), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    return indexes;
}

TrailsRenderer.prototype.draw_trails = function(sim, cam) {
    gl.useProgram(this.shaderprog);
    gl.enableVertexAttribArray(this.star_history_attr);
    gl.enableVertexAttribArray(this.star_color_attr);
    
    var perspective_matrix = cam.perspective_matrix();
    var mvMatrix = cam.translation_matrix();
    
    // prep buffer
    var indexes = this.prepare_star_buffer(sim, cam);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
    gl.vertexAttribPointer(this.star_color_attr, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.history_buffer);
    gl.vertexAttribPointer(this.star_history_attr, 3, gl.FLOAT, false, 0, 0);
    setMatrixUniforms(perspective_matrix, mvMatrix, this.shaderprog);
    
    for (var i=0; i<sim.size(); i++) {
        var star = sim.stars[i];
        var n = star.history.length;
        gl.drawArrays(gl.LINE_STRIP, indexes[i], n);   
    }
}



//============================================================================//


