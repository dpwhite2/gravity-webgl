gravity_shaders = {
shader_fs_text: { type: "x-shader/x-fragment", data: "#ifdef GL_ES\n\
precision highp float;\n\
#endif\n\
\n\
varying vec4 vColor;\n\
varying float starSize;\n\
vec2 center = vec2(1., 1.);\n\
\n\
void main(void) {\n\
    vec2 pt = vec2(2.*gl_PointCoord[0], 2.*gl_PointCoord[1]);\n\
    //float step_max = min(0.7, 6.0/starSize);\n\
    float d = smoothstep(0., 0.4, 1.0 - distance(center, pt));\n\
    gl_FragColor = vColor;\n\
    gl_FragColor[3] = d;\n\
}" },
trails_shader_fs_text: { type: "x-shader/x-fragment", data: "#ifdef GL_ES\n\
precision highp float;\n\
#endif\n\
\n\
varying vec4 vColor;\n\
//varying float starSize;\n\
//vec2 center = vec2(1., 1.);\n\
\n\
void main(void) {\n\
    //vec2 pt = vec2(2.*gl_PointCoord[0], 2.*gl_PointCoord[1]);\n\
    //float step_max = min(0.7, 6.0/starSize);\n\
    //float d = smoothstep(0., 0.4, 1.0 - distance(center, pt));\n\
    gl_FragColor = vColor;\n\
    //gl_FragColor[3] = d;\n\
}" },
shader_vs_text: { type: "x-shader/x-vertex", data: "attribute vec3 aStarPosition;\n\
attribute vec4 aStarColor;\n\
attribute float aStarSize;\n\
\n\
uniform mat4 uMVMatrix;\n\
uniform mat4 uPMatrix;\n\
varying vec4 vColor;\n\
varying float starSize;\n\
\n\
void main(void) {\n\
    //gl_PointSize = 8.0;\n\
    gl_PointSize = max(aStarSize, 3.0);\n\
    gl_Position = uPMatrix * uMVMatrix * vec4(aStarPosition, 1.0);\n\
    vColor = aStarColor;\n\
    starSize = aStarSize;\n\
}" },
trails_shader_vs_text: { type: "x-shader/x-vertex", data: "attribute vec3 aStarPosition;\n\
attribute vec4 aStarColor;\n\
//attribute float aStarSize;\n\
\n\
uniform mat4 uMVMatrix;\n\
uniform mat4 uPMatrix;\n\
varying vec4 vColor;\n\
//varying float starSize;\n\
\n\
void main(void) {\n\
    //gl_PointSize = 8.0;\n\
    //gl_PointSize = max(aStarSize, 3.0);\n\
    gl_Position = uPMatrix * uMVMatrix * vec4(aStarPosition, 1.0);\n\
    vColor = aStarColor;\n\
    //starSize = aStarSize;\n\
}" }
}
