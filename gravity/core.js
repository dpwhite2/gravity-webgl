
var app;

//============================================================================//
function orbital_velocity(u, x, y) {
    // u = G*M of central mass (which is assumed to be at 0,0)
    // x,y = position of orbiting mass
    var d = Math.sqrt(x*x + y*y);
    var s = Math.sqrt(u / d);
    var vx = s * (x/d);
    var vy = s * (y/d);
    return [-vy,vx];
}

function create_orbiting_star(u, x, y, m) {
    var v = orbital_velocity(u,x,y);
    return new Star(x, y, v[0], v[1], m);
}


function gravity_start() {
    var canvas = document.getElementById("glcanvas");
    app = new App(canvas);
    if (gl) {
        setInterval(gravity_do_turn, 15);
    }
    
    var v = 5.5;
    var m0 = 1100.;
    var m1 = 100.;
    var m2 = 100.;
    var mz = 2.;
    //var d = 270.;
    
    app.sim.add_star(new Star( 0., 0.,  0., 0., m0));
    
    //var dists = [120., 205., 300., 400., 500., 600., 700., 850., 1000., 1200.];//, 1000., 1100.];
    //var dists = [120., 180., 270., 400., 600., 900., 1350., 2000., 3000., 4500.];//, 1000., 1100.];
    //var dists = [120., 200., 250., 300., 500., 550., 600., 800., 900., 1000.];//, 1000., 1100.];
    //var dists = [100., 200., 300., 400., 500., 600., 700., 800.];//, 1000., 1100.];
    //var dists = [50.];
    /*var dists = [25., 75., 100., 110.];
    for (var i=0; i<4; i++) {
        var d = dists[dists.length-1]*1.3;
        dists.push(d);
    }*/
    //var dists = [35., 50., 150., 160., 175., 250., 275., 300., 315., 450.];
    var dists = [35., 150., 250.];
    for (var i=0; i<dists.length; i++) {
        var d = dists[i];
        /*app.sim.add_star(create_orbiting_star(m0, d, 0.,  mz));
        app.sim.add_star(create_orbiting_star(m0, -d, 0., mz));
        app.sim.add_star(create_orbiting_star(m0, 0., d,  mz));
        app.sim.add_star(create_orbiting_star(m0, 0., -d, mz));
        
        app.sim.add_star(create_orbiting_star(m0, d/Math.sqrt(2), d/Math.sqrt(2), mz));
        app.sim.add_star(create_orbiting_star(m0, -d/Math.sqrt(2), d/Math.sqrt(2), mz));
        app.sim.add_star(create_orbiting_star(m0, -d/Math.sqrt(2), -d/Math.sqrt(2), mz));
        app.sim.add_star(create_orbiting_star(m0, d/Math.sqrt(2), -d/Math.sqrt(2), mz));*/
        for (var j=0; j<360; j+=15) {
            var range = 0.7
            var m = ((Math.random()*range*2)+(1.-range)) * mz;
            //app.sim.add_star(create_orbiting_star(m0*1.5, d*Math.cos((Math.PI/180)*j), d*Math.sin((Math.PI/180)*j), m));
            app.sim.add_star(create_orbiting_star(m0*(Math.log(d)/5), d*Math.cos((Math.PI/180)*j), d*Math.sin((Math.PI/180)*j), m));
        }
        /*app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*0), d*Math.sin((Math.PI/180)*0), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*15), d*Math.sin((Math.PI/180)*15), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*30), d*Math.sin((Math.PI/180)*30), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*60), d*Math.sin((Math.PI/180)*60), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*90), d*Math.sin((Math.PI/180)*90), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*105), d*Math.sin((Math.PI/180)*105), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*120), d*Math.sin((Math.PI/180)*120), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*150), d*Math.sin((Math.PI/180)*150), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*180), d*Math.sin((Math.PI/180)*180), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*195), d*Math.sin((Math.PI/180)*195), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*210), d*Math.sin((Math.PI/180)*210), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*240), d*Math.sin((Math.PI/180)*240), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*270), d*Math.sin((Math.PI/180)*270), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*285), d*Math.sin((Math.PI/180)*285), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*300), d*Math.sin((Math.PI/180)*300), mz));
        app.sim.add_star(create_orbiting_star(m0, d*Math.cos((Math.PI/180)*330), d*Math.sin((Math.PI/180)*330), mz));*/
    }
    
    /*app.sim.add_star(new Star( d,    0.,  0.,  v, m2));
    app.sim.add_star(new Star(-d,    0.,  0., -v, m2));
    app.sim.add_star(new Star(   0.,  d, -v,  0., m2));
    app.sim.add_star(new Star(   0., -d,  v,  0., m2));
    
    app.sim.add_star(new Star( d/Math.sqrt(2), d/Math.sqrt(2), -v/Math.sqrt(2), v/Math.sqrt(2), m1));
    app.sim.add_star(new Star(-d/Math.sqrt(2), d/Math.sqrt(2), -v/Math.sqrt(2),-v/Math.sqrt(2), m1));
    app.sim.add_star(new Star(-d/Math.sqrt(2),-d/Math.sqrt(2),  v/Math.sqrt(2),-v/Math.sqrt(2), m1));
    app.sim.add_star(new Star( d/Math.sqrt(2),-d/Math.sqrt(2),  v/Math.sqrt(2), v/Math.sqrt(2), m1));*/
       
    gravity_mouse_move_events(canvas);
    setup_event_handlers();
}

function gravity_do_turn() {
    app.do_turn();
    document.getElementById("fps-value").textContent = app.fps().toFixed(1);
    document.getElementById("n-stars-value").textContent = app.n_stars();
    document.getElementById("zoom-value").textContent = app.current_zoom().toFixed(2);
}

//============================================================================//
function gravity_mouse_move_events(canvas) {
    var mover = null;
    var star_creator = null;
    
    function gravity_canvas_on_mousedown(evt) {
        if (evt.button === 0) { // left button only
            if (evt.ctrlKey) {
                evt.preventDefault();
                var coord = app.glcontext.client_to_world_coords(evt.layerX, evt.layerY);
                star_creator = { layer_x: evt.layerX, layer_y: evt.layerY, 
                                 world_x: coord[0], world_y: coord[1]};
                //app.sim.add_star(new Star( coord[0], coord[1],  0., 0., 10.));
            } else if (evt.shiftKey) {
                
            } else {
                evt.preventDefault();
                canvas.style.cursor = "move";
                mover = { last_x: evt.layerX, last_y: evt.layerY };
            }
        }
    }

    function gravity_canvas_on_mouseup(evt) {
        if (mover) {
            canvas.style.cursor = "auto";
            var dx = mover.last_x - evt.layerX;
            var dy = evt.layerY - mover.last_y;
            app.move(dx, dy);
            mover = null;
        } else if (star_creator) {
            var dx = evt.layerX - star_creator.layer_x;
            var dy = star_creator.layer_y - evt.layerY;
            var vx = dx * 0.1;
            var vy = dy * 0.1;
            var m = parseInt(document.getElementById("input-mass").value);
            app.sim.add_star(new Star( star_creator.world_x, star_creator.world_y,  vx, vy, m));
            star_creator = null;
        }
    }
    
    function gravity_canvas_on_mouseout(evt) {
        if (mover) {
            canvas.style.cursor = "auto";
            mover = null;
            star_creator = null;
        }
    }

    function gravity_canvas_on_mousemove(evt) {
        if (mover) {
            var dx = mover.last_x - evt.layerX;
            var dy = evt.layerY - mover.last_y;
            app.move(dx, dy);
            mover = { last_x: evt.layerX, last_y: evt.layerY };
        }
    }
    
    function gravity_canvas_on_mousewheel(evt) {
        //console.log("on_mousewheel");
        //console.log(evt);
        var delta = evt.detail ? evt.detail*(-120) : evt.wheelDelta;
        //console.log("delta: " + delta);
        app.glcontext.zoom(Math.round(delta/120));
        evt.preventDefault();
    }
    
    function gravity_window_on_resize(evt) {
        /*var canvas = document.getElementById("glcanvas");
        app.glcontext.set_viewport_size(canvas.clientWidth, canvas.clientHeight);
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;*/
        //console.log("I'm here");
    }
    
    canvas.onmousedown = gravity_canvas_on_mousedown;
    canvas.onmouseup = gravity_canvas_on_mouseup;
    canvas.onmousemove = gravity_canvas_on_mousemove;
    canvas.onmouseout = gravity_canvas_on_mouseout;
    if (canvas.onmousewheel !== undefined) {
        canvas.onmousewheel = gravity_canvas_on_mousewheel;
    } else {
        canvas.addEventListener('DOMMouseScroll', gravity_canvas_on_mousewheel, false);
    }
    window.onresize = gravity_window_on_resize;
    gravity_window_on_resize();
}

function setup_event_handlers() {
    var reset = document.getElementById("button-reset");
    reset.onclick = function() {
        app.reset_sim();
    }
    
    var mass = document.getElementById("input-mass");
    mass.onkeypress = function(evt) {
        var c = String.fromCharCode(evt.charCode);
        if (c === "0" || c === "1" || c === "2" || c === "3" || c === "4" ||
            c === "6" || c === "6" || c === "7" || c === "8" || c === "9") {
            // do nothing
        } else {
            evt.preventDefault();
        }
    }
}

//============================================================================//


