
(function() {
//============================================================================//
function Star(x, y, vx, vy, m) {
    this.pos = $V([x, y]);
    var vx = vx || 0.;
    var vy = vy || 0.;
    this.v = $V([vx, vy]);
    this.m = m || 1.0;
    this.F = $V([0.,0.]);
    this.r = 1.; // radius
    this.actual_r = 1.;
    this.calc_radius();
    this.history = [];
}

Star.prototype.add_force = function(F) {
    this.F = this.F.add(F);
}

Star.prototype.append_history = function(pos) {
    if (this.history.length > gravity.config.max_history_size) {
        this.history.shift();  // remove first element
    }
    this.history.push(pos);
}

Star.prototype.update_history = function() {
    this.append_history(this.pos.dup());
}

Star.prototype.apply_forces = function() {
    var a = this.F.multiply(1./this.m);
    var v = a.add(this.v); // a*t + v
    var vv = v.add(this.v).multiply(0.5); // avg of previous v and new v
    this.pos = a.multiply(0.5).add(vv).add(this.pos); // 0.5*a*t^2 + v*t + s
    this.v = v;
    this.F = $V([0.,0.]);
}

Star.prototype.calc_radius = function() {
    this.r = Math.max(Math.pow(this.m, 1./3.)*1.5, 1.0);
    this.actual_r = Math.max(Math.pow(this.m, 1./3.), 1.0);
}

gravity.Star = Star;



//============================================================================//
function Sim() {
    this.stars = [];
    this.turn = 0;
}

Sim.prototype.add_star = function(star) {
    this.stars.push(star);
    return star;
}

Sim.prototype.delete_star = function(index) {
    if (index < this.stars.length) {
        this.stars.splice(index, 1);
    }
}

Sim.prototype.size = function() {
    return this.stars.length;
}

Sim.prototype.calc_forces = function() {
    for (var i=0; i<this.stars.length; i++) {
        var star0 = this.stars[i];
        for (var j=i+1; j<this.stars.length; j++) {
            var star1 = this.stars[j];
            var ds = star0.pos.subtract(star1.pos);
            var dist = ds.modulus();  // magnitude
            var Fs = (star0.m * star1.m) / (dist * dist);  // Gmm/r^2
            // convert Force scalar to Force vector
            var F = ds.multiply(Fs / dist);
            if (dist <= 0.) {
                var xxx = 0.;
            }
            //console.assert(dist > 0.);
            star1.add_force(F);
            F.elements[0] = -F.elements[0];
            F.elements[1] = -F.elements[1];
            star0.add_force(F);
        }
    }
}

Sim.prototype.apply_forces = function() {
    for (var i=0; i<this.stars.length; i++) {
        this.stars[i].apply_forces();
    }
}

Sim.prototype.handle_collisions = function() {
    for (var i=0; i<this.stars.length; i++) {
        var deleted_star = false;
        var star0 = this.stars[i];
        for (var j=i+1; j<this.stars.length; j++) {
            var star1 = this.stars[j];
            var ds = star0.pos.subtract(star1.pos);
            var dist = ds.modulus();  // magnitude
            // if stars are too close, collide
            if (dist < star0.actual_r + star1.actual_r) {
                // ...delete smaller star
                var m = star0.m + star1.m;
                var ms = star1.m / m; // fraction of combined mass that is p1 mass
                // new position is partway between the two stars; closer to the heavier one
                var pos = star1.pos.subtract(star0.pos).multiply(ms).add(star0.pos);
                // conserve momentum
                var p = star0.v.multiply(star0.m).add( star1.v.multiply(star1.m) );
                var v = p.multiply(1./m);
                // create new star;
                var history = null;
                if (star0.m > star1.m) {
                    history = star0.history;
                } else {
                    history = star1.history;
                }
                var s = new Star(pos.elements[0], pos.elements[1], v.elements[0], v.elements[1], m);
                s.history = history;
                this.stars[i] = s;
                // delete latter star
                this.delete_star(j);
                deleted_star = true;
                break;
            }
        }
        if (deleted_star) {
            // check for collisions again, starting with current 'i'
            i--;
        }
    }
}

Sim.prototype.remove_distant_stars = function() {
    for (var i=0; i<this.stars.length; i++) {
        var star = this.stars[i];
        var d = star.pos.modulus();
        if (d > gravity.config.star_distance_limit) {
            this.delete_star(i);
            i--;
        }
    }
}

Sim.prototype.update_histories = function() {
    for (var i=0; i<this.stars.length; i++) {
        this.stars[i].update_history();
    }
}

Sim.prototype.do_turn = function() {
    this.handle_collisions();
    this.remove_distant_stars();
    this.calc_forces();
    this.apply_forces();
    if (this.turn % gravity.config.history_interval == 0) {
        this.update_histories();
    }
    this.turn++;
}

gravity.Sim = Sim;

//============================================================================//
})();


