
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

function create_orbiting_star(u, x, y, m) {
    var v = orbital_velocity(u, 0., 0., x, y);
    return new gravity.Star(x, y, v[0], v[1], m);
}

function create_orbiting_star2(u, cx, cy, x, y, m) {
    var v = orbital_velocity(u, cx, cy, x, y);
    return new gravity.Star(x, y, v[0], v[1], m);
}

//============================================================================//
// function new_preset(name, func) {
    // var inserted = false;
    // for (var i=0; i<gravity.presets.length; i++) {
        // if (name < gravity.presets[i].name) {
            // gravity.presets.splice(i, 0, {name: name, func: func});
            // inserted = true;
        // }
    // }
    // if (!inserted) {
        // gravity.presets.push({name: name, func: func});
    // }
// }

gravity.presets = {
    twins: function(sim) {
        var m = 2500.;
        var x = 120.;
        var y = 0.;
        var vx = 0.;
        var vy = 1.2;
        sim.add_star(new gravity.Star(x,y, vx,vy, m));
        sim.add_star(new gravity.Star(-x,-y, -vx,-vy, m));
    }
    
};

//============================================================================//
})();
