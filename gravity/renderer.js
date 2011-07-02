
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
function TrailsTexRenderer() {
    this._init_shaders();
    this._init_tex_shaders();
    this._init_buffers();
    this._init_framebuffer();
    this.histories = [];
    this.colors = [];
    this.turn = 0;
}

TrailsTexRenderer.prototype._init_buffers = function() {
    this.history_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.history_buffer);
    this.color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
    
    this.bg_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bg_buffer);
    var bgrect = [ 
        0, 0, 0,
        0, 1024, 0,
        1024, 0, 0,
        1024, 1024, 0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bgrect), gl.STATIC_DRAW);
    
    this.tex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buffer);
    // var tex_coords = [
        // 1.0, 1.0,
        // 0.0, 1.0,
        // 1.0, 0.0,
        // 0.0, 0.0
    // ];
    var tex_coords = [
        0.0, 0.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
    
    this.fader_vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.fader_vertex_buffer);
    var fader_coords = [
        0, 0, 0,
        0, 1024, 0,
        1024, 0, 0,
        1024, 1024, 0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fader_coords), gl.STATIC_DRAW);
    
    this.fader_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.fader_color_buffer);
    var fader_colors = [
        0., 0., 0., 0.01,
        0., 0., 0., 0.01,
        0., 0., 0., 0.01,
        0., 0., 0., 0.01
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fader_colors), gl.STATIC_DRAW);
}

TrailsTexRenderer.prototype.clear_trails = function() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

TrailsTexRenderer.prototype._init_framebuffer = function() {
    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    
    this.renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1024, 1024);
    
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);
        
    /*gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendColor(0.,0.,0.,1.0);*/
    
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

TrailsTexRenderer.prototype._init_shaders = function() {
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

TrailsTexRenderer.prototype._init_tex_shaders = function() {
    var tex_fragment_shader = get_shader_js(gl, "tex_trails_shader_fs_text");
    var tex_vertex_shader = get_shader_js(gl, "tex_trails_shader_vs_text");

    // Create the shader program
    this.tex_shaderprog = gl.createProgram();
    gl.attachShader(this.tex_shaderprog, tex_fragment_shader);
    gl.attachShader(this.tex_shaderprog, tex_vertex_shader);
    gl.linkProgram(this.tex_shaderprog);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(this.tex_shaderprog, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    gl.useProgram(this.tex_shaderprog);

    this.bg_coords_attr = gl.getAttribLocation(this.tex_shaderprog, "aVertexPosition");
    this.tex_coord_attr = gl.getAttribLocation(this.tex_shaderprog, "aTextureCoord");
    this.sampler_uniform = gl.getUniformLocation(this.tex_shaderprog, "uSampler");
}

TrailsTexRenderer.prototype.calc_color = function(r) {
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

TrailsTexRenderer.prototype.prepare_star_buffer = function(sim, cam) {
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

TrailsTexRenderer.prototype.fade_trails = function() {
    gl.useProgram(this.shaderprog);
    gl.enableVertexAttribArray(this.star_history_attr);
    gl.enableVertexAttribArray(this.star_color_attr);
    
    // fade old trails
    var perspective_matrix = makeOrtho(0, 1000, 0, 700, -1., 1.);
    var mvMatrix = mvTranslate(loadIdentity(), [0.0, 0.0, 0.0]);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.fader_color_buffer);
    gl.vertexAttribPointer(this.star_color_attr, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.fader_vertex_buffer);
    gl.vertexAttribPointer(this.star_history_attr, 3, gl.FLOAT, false, 0, 0);
    setMatrixUniforms(perspective_matrix, mvMatrix, this.shaderprog);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

TrailsTexRenderer.prototype.draw_trails_impl = function(sim, cam) {
    gl.useProgram(this.shaderprog);
    gl.enableVertexAttribArray(this.star_history_attr);
    gl.enableVertexAttribArray(this.star_color_attr);
    
    if (this.turn % 8 === 0) {
        this.fade_trails();
    }
    
    // draw trails
    var scaler = 1.0;
    var perspective_matrix = cam.perspective_matrix(scaler);
    var mvMatrix = cam.translation_matrix(scaler);
    
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
    
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

var checked_framebuffer = false;

TrailsTexRenderer.prototype.draw_trails = function(sim, cam) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    /*if (!checked_framebuffer) {
        console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER));
        checked_framebuffer = true;
        var h = 20;
        var w = 20;
        var uarray = new Uint8Array(h*w);
        gl.readPixels(500,350,w,h, gl.RGBA, gl.UNSIGNED_TYPE, uarray);
        console.log(uarray.buffer);
        //console.log(uarray.get(0));
    }*/
    this.draw_trails_impl(sim,cam);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    gl.useProgram(this.tex_shaderprog);
    
    gl.enableVertexAttribArray(this.bg_coords_attr);
    gl.enableVertexAttribArray(this.tex_coord_attr);
    
    var perspective_matrix = makeOrtho(0, 1000, 0, 700, -1., 1.);
    var mvMatrix = mvTranslate(loadIdentity(), [0.0, 0.0, 0.0]);
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bg_buffer);
    gl.vertexAttribPointer(this.bg_coords_attr, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buffer);
    gl.vertexAttribPointer(this.tex_coord_attr, 2, gl.FLOAT, false, 0, 0);
    setMatrixUniforms(perspective_matrix, mvMatrix, this.tex_shaderprog);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.sampler_uniform, 0);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    this.turn++;
}
//============================================================================//


