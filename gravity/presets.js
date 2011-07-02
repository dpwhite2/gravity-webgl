
//gravity.presets = [];



(function() {
//============================================================================//
function orbital_velocity(u, cx, cy, x, y) {
    // u = G*M of central mass
    // cx,cy position of central mass
    // x,y = position of orbiting mass
    var dx = x - cx;
    var dy = y - cy;
    var d = Math.sqrt(dx*dx + dy*dy);
    var s = Math.sqrt(u / d);
    var vx = s * (dx/d);
    var vy = s * (dy/d);
    return [-vy,vx];
}
function orbital_velocity3(sun, x, y) {
    var dx = x - sun.pos.elements[0];
    var dy = y - sun.pos.elements[1];
    var d = Math.sqrt(dx*dx + dy*dy);
    var s = Math.sqrt(sun.m / d);
    var vx = s * (dx/d);
    var vy = s * (dy/d);
    return [-vy + sun.v.elements[0], vx + sun.v.elements[1]];
}

function create_orbiting_star(u, x, y, m) {
    var v = orbital_velocity(u, 0., 0., x, y);
    return new gravity.Star(x, y, v[0], v[1], m);
}

function create_orbiting_star2(u, cx, cy, x, y, m) {
    var v = orbital_velocity(u, cx, cy, x, y);
    return new gravity.Star(x, y, v[0], v[1], m);
}

function create_orbiting_star3(sun, x, y, m) {
    var v = orbital_velocity3(sun, x, y);
    return new gravity.Star(x, y, v[0], v[1], m);
}

function create_orbiting_star_angle_distance(sun, a, d, m) {
    var x = d*Math.cos(a) + sun.pos.elements[0];
    var y = d*Math.sin(a) + sun.pos.elements[1];
    return create_orbiting_star3(sun, x, y, m);
}

//============================================================================//
gravity.presets = {
    "Twins": function(sim) {
        var m = 2500.;
        var x = 120.;
        var y = 0.;
        var vx = 0.;
        var vy = 1.2;
        sim.add_star(new gravity.Star(x,y, vx,vy, m));
        sim.add_star(new gravity.Star(-x,-y, -vx,-vy, m));
    },
    "Simple Solar System": function(sim) {
        var m0 = 1000.;
        var m1 = 10.;
        var m2 = 0.1;
        var m3 = 10.;
        var m4 = 0.1;
        
        var x1 = 300.;
        var y1 = 0.;
        var x2 = 316.;
        var y2 = 0.;
        
        var x3 = -650.;
        var y3 = 0.;
        var x4 = -675.;
        var y4 = 0.;
        
        var star0 = sim.add_star(new gravity.Star(0.,0., 0.,0., m0));
        var star1 = sim.add_star(create_orbiting_star3(star0, x1, y1, m1));
        var star2 = sim.add_star(create_orbiting_star3(star1, x2, y2, m2));
        var star3 = sim.add_star(create_orbiting_star3(star0, x3, y3, m3));
        var star4 = sim.add_star(create_orbiting_star3(star3, x4, y4, m4));
    },
    "Hexagon": function(sim) {
        var m0 = 2000.;
        var m1 = 10.;
        var d = 250.;
        var a = 60;
        
        var star0 = sim.add_star(new gravity.Star(0.,0., 0.,0., m0));
        for (var i=0; i<360; i+=a) {
            var rad = (Math.PI/180)*i;
            sim.add_star(create_orbiting_star_angle_distance(star0, rad, d, m1));
        }
    }
    
};

//============================================================================//
})();
