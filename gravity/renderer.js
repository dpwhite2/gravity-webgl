
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
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

    this.size_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.size_buffer);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.sizes), gl.STATIC_DRAW);

    this.color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
}

StarsRenderer.prototype._init_shaders = function() {
    //var fragmentShader = getShader(gl, "shader-fs");
    //var vertexShader = getShader(gl, "shader-vs");
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
    gl.enableVertexAttribArray(this.star_pos_attr);
    this.star_color_attr = gl.getAttribLocation(this.shaderprog, "aStarColor");
    gl.enableVertexAttribArray(this.star_color_attr);
    this.star_size_attr = gl.getAttribLocation(this.shaderprog, "aStarSize");
    gl.enableVertexAttribArray(this.star_size_attr);
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

StarsRenderer.prototype.update_buffers = function(sim, glctx) {
    this.positions = [];
    this.sizes = [];
    this.colors = [];
    for (var i=0; i<sim.size(); i++) {
        var star = sim.stars[i];
        this.positions.splice(this.positions.length, 0, star.pos.elements[0], star.pos.elements[1], 0.0);
        this.sizes.splice(this.sizes.length, 0, Math.max(star.r/glctx._zoom, 1.0));
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

StarsRenderer.prototype.draw_stars = function(sim, glctx) {
    this.update_buffers(sim, glctx);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var perspective_matrix = makeOrtho(glctx.left(), glctx.right(), 
                                       glctx.bottom(), glctx.top(), -1., 1.);
    
    /*var perspective_matrix = makeOrtho(-200, 200, 
                                       -200, 200, -1., 1.);*/
    var mvMatrix = loadIdentity();
    mvMatrix = mvTranslate(mvMatrix, [-0.0, 0.0, -0.0]);

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

