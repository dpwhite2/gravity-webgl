
(function() {
//============================================================================//
gravity.getShader = function(gl, id) {
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

gravity.get_shader_js = function(gl, name) {
    var source = gravity.shaders[name]["data"];
    var type = gravity.shaders[name]["type"];
    
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
function Camera(width, height) {
    this.width = width;
    this.height = height;
    this.cx = 0.;
    this.cy = 0.;
    this._zoom = 1.;
    this._maxzoomin = 1./gravity.config.max_zoom_in;
    this._minzoomout = 1./gravity.config.min_zoom_out;
}

Camera.prototype.zoom = function(n) {
    if (n > 0) {
        for (var i=0; i<n && this._zoom > this._maxzoomin; i++) {
            this._zoom /= gravity.config.zoom_multiplier;
            this.cx *= gravity.config.zoom_multiplier;
            this.cy *= gravity.config.zoom_multiplier;
        }
    } else {
        for (var i=0; i < -n && this._zoom < this._minzoomout; i++) {
            this._zoom *= gravity.config.zoom_multiplier;
            this.cx /= gravity.config.zoom_multiplier;
            this.cy /= gravity.config.zoom_multiplier;
        }
    }
}

Camera.prototype.get_zoom = function() {
    return this._zoom;
}

Camera.prototype.move_viewport = function(dx, dy) {
    this.cx += dx;
    this.cy += dy;
}

Camera.prototype.client_to_world_coords = function(cx, cy) {
    var x = ((cx - this.width / 2.) + this.cx) * this._zoom;
    var y = ((this.height / 2. - cy) + this.cy) * this._zoom;
    return [x, y];
}

Camera.prototype.perspective_matrix = function(scaler) {
    var c = 1.0;
    if (scaler) {
        c = scaler;
    }
    var left = (-this.width/2.) * this._zoom * c;
    var right = (this.width/2.) * this._zoom * c;
    var bottom = (-this.height/2.) * this._zoom * c;
    var top = (this.height/2.) * this._zoom * c;
    return makeOrtho(left, right, bottom, top, -1., 1.);
}

Camera.prototype.translation_matrix = function(scaler) {
    var c = 1.0;
    if (scaler) {
        c = scaler;
    }
    var mvMatrix = loadIdentity();
    return mvTranslate(mvMatrix, [-this.cx * this._zoom * c, -this.cy * this._zoom * c, 0.0]);
}

gravity.Camera = Camera;

//============================================================================//

function GLContext(canvas) {
    this.true_width = 1;
    this.true_height = 1;
    this._initgl(canvas);
    this._confgl();
}

GLContext.prototype.set_viewport_size = function(w, h) {
    this.true_width = w;
    this.true_height = h;
    gl.viewportWidth = w;
    gl.viewportHeight = h;
}

GLContext.prototype.reset = function() {
    this.set_viewport_size(this.true_width, this.true_height);
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

gravity.GLContext = GLContext;

//============================================================================//
})();




