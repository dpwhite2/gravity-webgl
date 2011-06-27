
//============================================================================//
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);

    if (!shaderScript) { return null; }

    var theSource = "";
    var currentChild = shaderScript.firstChild;
    while(currentChild) {
        if (currentChild.nodeType == 3) {
            theSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    var shader;

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;  // Unknown shader type
    }
    gl.shaderSource(shader, theSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function get_shader_js(gl, name) {
    var source = gravity_shaders[name]["data"];
    var type = gravity_shaders[name]["type"];
    
    var shader;
    if (type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;  // Unknown shader type
    }
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
    
}

//============================================================================//
var gl = null;

function GLContext(canvas) {
    //this.viewport = {width:1, height:1, left:0, right:1, bottom:0, top:1}
    //this._init_shaders();
    this.width = 1.;
    this.height = 1.;
    this.cx = 0.;
    this.cy = 0.;
    this._zoom = 1.; // _zoom is stored as the inverse of the "usual" zoom value; e.g. to zoom in, _zoom is *less* than 1
    this._maxzoomin = 1./gravity_config.max_zoom_in;
    this._minzoomout = 1./gravity_config.min_zoom_out;
    this._initgl(canvas);
    this._confgl();
}

GLContext.prototype.left = function() { return -(this.width/2.) + this.cx; }
GLContext.prototype.right = function() { return (this.width/2.) + this.cx; }
GLContext.prototype.bottom = function() { return -(this.height/2.) + this.cy; }
GLContext.prototype.top = function() { return (this.height/2.) + this.cy; }

GLContext.prototype.set_viewport_size = function(w, h) {
    this.true_width = w;
    this.true_height = h;
    this.width = w * this._zoom;
    this.height = h * this._zoom;
    gl.viewportWidth = w;
    gl.viewportHeight = h;
}

GLContext.prototype.reset = function() {
    this._zoom = 1.;
    this.set_viewport_size(this.true_width, this.true_height);
    this.cx = 0.;
    this.cy = 0.;
}

GLContext.prototype.zoom = function(n) {
    //console.log("n: " + n);
    if (n > 0) {
        for (var i=0; i<n && this._zoom > this._maxzoomin; i++) {
            this._zoom /= gravity_config.zoom_multiplier;
        }
    } else {
        for (var i=0; i < -n && this._zoom < this._minzoomout; i++) {
            this._zoom *= gravity_config.zoom_multiplier;
        }
    }
    
    this.width = this._zoom * this.true_width;
    this.height = this._zoom * this.true_height;
}

GLContext.prototype.move_viewport = function(dx, dy) {
    this.cx += dx * this._zoom;
    this.cy += dy * this._zoom;
}

GLContext.prototype.client_to_world_coords = function(cx, cy) {
    var x = (cx - this.true_width / 2.) * this._zoom + this.cx;
    var y = (this.true_height/2. - cy) * this._zoom + this.cy;
    return [x,y];
}

GLContext.prototype._initgl = function(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        this.set_viewport_size(canvas.clientWidth, canvas.clientHeight);
    }
    catch(e) {
    }

    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
}

GLContext.prototype._confgl = function() {
    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
        gl.clearDepth(1.0);                                     // Clear everything
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.blendColor(0.,0.,0.,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
        
        //initBuffers();
        
        //setInterval(drawScene, 15);
    }
}


//============================================================================//





