

//============================================================================//
function App(canvas) {
    //var canvas = document.getElementById("glcanvas");
    
    this.glcontext = new GLContext(canvas);
    this.star_renderer = new StarsRenderer();
    this.sim = new Sim();
    this.times = [];
    this.last_fps = 0.;
    this._fps_turns = 50;  // calculate the frame rate after this many turns
}

App.prototype.reset_sim = function() {
    this.sim = new Sim();
}

App.prototype.move = function(dx, dy) {
    this.glcontext.move_viewport(dx, dy);
}

App.prototype.do_turn = function() {
    this.add_frametime();
    this.sim.do_turn();
    this.star_renderer.draw_stars(this.sim, this.glcontext);
}

App.prototype.add_frametime = function() {
    this.times.push(Date.now());
    if (this.times.length > this._fps_turns) {
        this.times.shift();
    }
}

App.prototype.fps = function() {
    if (this.times.length >= this._fps_turns) {
        var secs = (this.times[this.times.length-1] - this.times[0]) / 1000.;
        this.last_fps = (this.times.length-1) / secs;
        this.times.splice(0, this._fps_turns/2);
    }
    return this.last_fps;
}

App.prototype.n_stars = function() {
    return this.sim.size();
}

App.prototype.current_zoom = function() {
    return 1./this.glcontext._zoom;
}

//============================================================================//



