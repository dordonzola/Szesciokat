console.error("works");
const vertexShaderTxt = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`;
const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;

const Hex = function () {
  const canvas = document.getElementById("main-canvas");
  const gl = canvas.getContext("webgl");
  let canvasColor = [0.2, 0.5, 0.8];

  checkGl(gl);

  gl.clearColor(...canvasColor, 1.0); // R, G, B,  A
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderTxt);
  gl.shaderSource(fragmentShader, fragmentShaderTxt);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  checkShaderCompile(gl, vertexShader);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);

  gl.validateProgram(program);

  let hexVerts = [
    // X, Y      R   G    B
    -0.25,
    0.0,
    1.0,
    0.0,
    0.0, //
    -0.1,
    0.2,
    1.0,
    1.0,
    1.0, //
    0.1,
    0.2,
    0.0,
    0.0,
    1.0, //
    0.25,
    0.0,
    1.0,
    1.0,
    1.0, //
    0.1,
    -0.2,
    0.0,
    1.0,
    0.0, //
    -0.1,
    -0.2,
    1.0,
    1.0,
    1.0, //
  ];

  const hexVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, hexVertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexVerts), gl.STATIC_DRAW);

  const posAttribLocation = gl.getAttribLocation(program, "vertPosition");
  gl.vertexAttribPointer(
    posAttribLocation,
    2,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.enableVertexAttribArray(posAttribLocation);

  const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
  gl.vertexAttribPointer(
    colorAttribLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(colorAttribLocation);

  // render time

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
};

function checkGl(gl) {
  if (!gl) {
    console.log("WebGL not suppoerted, use another browser");
  }
}

function checkShaderCompile(gl, shader) {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("shader not compiled", gl.getShaderInfoLog(shader));
  }
}

function checkLink(gl, program) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("linking error", gl.getProgramInfoLog(program));
  }
}
