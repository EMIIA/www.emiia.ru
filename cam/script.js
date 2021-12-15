
// Creates WebGL/WebGL2 context used to upload depth video to texture,
// read the pixels to Float buffer and optionally render the texture.
function GL(canvasId) {
  var canvas = document.getElementById(canvasId);
  var gl = canvas.getContext("webgl2");
  if (gl) {
    // The extension tells us if we can use single component R32F texture format.
    gl.color_buffer_float_ext = gl.getExtension('EXT_color_buffer_float');
  } else {
    gl = canvas.getContext("webgl");
  }
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  // Shaders and program are needed only if rendering depth texture.
  var vertex_shader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertex_shader, "attribute vec2 v;varying vec2 t;void main(){gl_Position=vec4(v.x*2.0-1.0,1.0-v.y*2.0,0,1);t=v;}");
  gl.compileShader(vertex_shader);
  var pixel_shader = gl.createShader(gl.FRAGMENT_SHADER);
  
  //gl.shaderSource(pixel_shader, "precision mediump float;uniform sampler2D s;varying vec2 t;void main(){vec4 tex=texture2D(s,t); gl_FragColor=vec4(tex.r, tex.g, tex.b, tex.a);}");
  gl.shaderSource(pixel_shader, "precision mediump float;uniform sampler2D s;varying vec2 t;void main(){vec4 tex=texture2D(s,t); gl_FragColor=vec4(tex.r*1.5, tex.r*1.5, tex.r*1.5,  tex.a);}");
  gl.compileShader(pixel_shader);
  var program  = gl.createProgram();
  gl.attachShader(program, vertex_shader);
  gl.attachShader(program, pixel_shader);
  gl.linkProgram(program);
  gl.useProgram(program);
  var vertex_location = gl.getAttribLocation(program, "v");
  gl.enableVertexAttribArray(vertex_location);
  gl.uniform1i(gl.getUniformLocation(program, "s"), 0);
  var vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,1,0,1,1,0,1]), gl.STATIC_DRAW);
  var index_buffer= gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
  var depth_texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, depth_texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // Framebuffer for reading back the texture.
  var framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, depth_texture, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.vertex_buffer = vertex_buffer;
  gl.vertex_location = vertex_location;
  gl.index_buffer = index_buffer;
  gl.depth_texture = depth_texture;
  gl.framebuffer = framebuffer;
  return gl;
}
function getConstraintsForDepthDevice() {
  return new Promise(function(resolve, reject) {
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      for (var i = 0; i < devices.length; ++i) {
        if (devices[i].label.indexOf("Depth") != -1)
          return resolve({video:{deviceId: {exact: devices[i].deviceId}}});
      }
      for (var i = 0; i < devices.length; ++i) {
        if (devices[i].label.indexOf("RealSense") != -1 && devices[i].kind === 'videoinput')
          return resolve({video:{deviceId: {exact: devices[i].deviceId}}});
      }
      //alert("No depth capture device found");
      console.log("No depth capture device found");
      return reject("No depth capture device found");
    })
  });
}
function getDepthStream() {
  return new Promise(function(resolve, reject) {
    getConstraintsForDepthDevice()
    .then(function(constraints) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }).then(function(stream) {
      return resolve(stream);
    });
  });
}
var gl;
var video_frame_available = false;
var read_buffer;
var read_format;
var canvas_2d = document.getElementById("canvas2D");
var context_2d = canvas_2d.getContext("2d");
var select_device = document.querySelector('select#selectVideoDevice');
var video = createOffscreenVideo();
video.oncanplay = function(){ video_frame_available=true; }
video.addEventListener("play", frameLoop);
function frameLoop() {
  if (video && video.paused && !touch_listener_added) {
    touch_listener_added = true;
    window.addEventListener("touchstart", onVideoTouchStart, true);
  }
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, gl.depth_texture);
  if (video_frame_available) {
    // Upload the video frame to texture.
    if (gl.color_buffer_float_ext) {      
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, gl.RED, gl.FLOAT, video);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, gl.RGBA, gl.FLOAT, video);
    }
    
    // Read it back to buffer.
    readPixels();
    
    // TODO: process pixels.
    
    // Put read and processed pixels to 2D canvas.
    // Note: This is just one of scenarios for the demo. You can directly
    // bind video to 2D canvas without using WebGL as intermediate step.
    putReadPixelsTo2DCanvas();
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertex_buffer);
  gl.vertexAttribPointer(gl.vertex_location, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.index_buffer);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  window.requestAnimationFrame(frameLoop);
}
function readPixels() {
  // Bind the framebuffer the texture is color-attached to.
  gl.bindFramebuffer(gl.FRAMEBUFFER, gl.framebuffer);
  
  if (!read_buffer) {
    read_format = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT);
    if (read_format == gl.RED && gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE) == gl.FLOAT) {
      read_buffer = new Float32Array(video.width * video.height);
    } else {
      read_format = gl.RGBA;
      read_buffer = new Float32Array(video.width * video.height * 4);
    }
  }
  gl.readPixels(0, 0, video.width, video.height, read_format, gl.FLOAT, read_buffer);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
function putReadPixelsTo2DCanvas() {
  var img = context_2d.getImageData(0, 0, video.width, video.height);
  var data = img.data;
  var stride = (read_format === gl.RED) ? 1 : 4;
  var j = 0;
  for (var i = 0; i < data.length; i += 4, j += stride) {
     data[i] = read_buffer[j] * 255;
     data[i+3] = 255;
  }
  context_2d.putImageData(img, 0, 0);
}
function createOffscreenVideo() {
  var video = document.createElement("video");
  video.autoplay = true;
  video.loop = true;
  video.crossOrigin = "anonymous";
  video.width = 640;
  video.height = 480;
  return video;
}
// If needed, tap to start video.
var touch_listener_added = false;
function onVideoTouchStart() {
  touch_listener_added = false;
  window.removeEventListener("touchstart", onVideoTouchStart, true);
  video.play();
}
function allDevicesEnumerated(device_infos) {
  var selected = select_device.value;
  var selection_still_exists = false;
  while (select_device.firstChild)
    select_device.removeChild(select_device.firstChild);
  for (var i = 0; i !== device_infos.length; ++i) {
    var device_info = device_infos[i];
    if (device_info.kind !== 'videoinput')
      continue;
    var option = document.createElement('option');
    option.value = device_info.deviceId;
    option.text = device_info.label || 'camera ' + (select_device.length + 1);
    select_device.appendChild(option);
    if (option.value === selected)
      selection_still_exists = true;
  }
  if (selection_still_exists) {
    select_device.value = selected;
  } else if (!selected) {
    // If no other device is selected, set the initial selection to depth device.
    getConstraintsForDepthDevice().then(function(constraints) {
      select_device.value = constraints.video.deviceId.exact;
    }).catch(function(error) {
      console.log("Set initial selection error:" + error);
    });
  }
}
function streamOpened(stream) {
  video.srcObject = stream;
  // Get all devices to drop-down list.
  return navigator.mediaDevices.enumerateDevices();
}
function reload() {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  // If the item in drop-down list is selected, use it.
  var openStreamFunction = select_device.value ? function() {
    return navigator.mediaDevices.getUserMedia({video: {deviceId: {exact: select_device.value}}});
  } : getDepthStream;
  openStreamFunction().then(streamOpened).then(allDevicesEnumerated).catch(function(error) {
    console.log(error);
  });
}
function onLoad() {
  gl = GL("canvasGL");
  select_device.onchange = reload;
  reload();
}
