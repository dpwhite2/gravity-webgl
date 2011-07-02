
(function() {
//============================================================================//
function App(canvas) {
    this.glcontext = new gravity.GLContext(canvas);
    this.star_renderer = new gravity.StarsRenderer();
    //this.trails_renderer = new gravity.TrailsRenderer();
    this.tex_trails_renderer = new gravity.TrailsTexRenderer();
    this.cam = new gravity.Camera(this.glcontext.true_width, this.glcontext.true_height);
    this.sim = new gravity.Sim();
    this.times = [];
    this.last_fps = 0.;
    this._fps_turns = 50;  // calculate the frame rate after this many turns
}

App.prototype.reset_sim = function() {
    this.glcontext.reset();
    this.tex_trails_renderer.clear_trails();
    this.cam = new gravity.Camera(this.glcontext.true_width, this.glcontext.true_height);
    this.sim = new gravity.Sim();
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
    this.render();
}

App.prototype.render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //this.trails_renderer.draw_trails(this.sim, this.cam);
    this.tex_trails_renderer.draw_trails(this.sim, this.cam);
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

gravity.App = App;

//============================================================================//
})();


