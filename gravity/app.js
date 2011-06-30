

//============================================================================//
function App(canvas) {
    this.glcontext = new GLContext(canvas);
    this.star_renderer = new StarsRenderer();
    this.cam = new Camera(this.glcontext.true_width, this.glcontext.true_height);
    this.sim = new Sim();
    this.times = [];
    this.last_fps = 0.;
    this._fps_turns = 50;  // calculate the frame rate after this many turns
}

App.prototype.reset_sim = function() {
    this.glcontext.reset();
    this.cam = new Camera(this.glcontext.true_width, this.glcontext.true_height);
    this.sim = new Sim();
}

App.prototype.move = function(dx, dy) {
    this.cam.move_viewport(dx, dy);
}

App.prototype.zoom = function(n) {
    this.cam.zoom(n);
}

App.prototype.do_turn = function() {
    this.add_frametime();
    this.sim.do_turn();
    this.star_renderer.draw_stars(this.sim, this.cam);
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
    return 1./this.cam.get_zoom();
}

//============================================================================//



