var renderer, scene, camera, spheres;

var ww = window.innerWidth,
wh = window.innerHeight;

function init() {

	renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('canvas'),
		antialias: true
	});
	renderer.setSize(ww, wh);
	renderer.setClearColor(0xFFFFFF);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(50, ww / wh, 0.1, 10000);
	camera.position.set(180, 100, 180);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(camera);

	controls = new THREE.OrbitControls(camera);

	createField();
}

var size = 60;
function createField() {
  spheres = new THREE.Object3D();

	var geometry  = new THREE.SphereGeometry(4,10,10);
	for (var y = -size / 2; y < size / 2; y++) {
		for (var x = -size / 2; x < size / 2; x++) {

			var material = new THREE.MeshBasicMaterial({color : 0x000000});
			var sphere = new THREE.Mesh(geometry, material);
			sphere.position.set(x*4,0,y*4);
			sphere.org = {x : x*4,z : y*4};
			spheres.add(sphere);
		}
	}

	scene.add(spheres);
	requestAnimationFrame(render);
}

noise.seed(Math.random());
function render(a) {
	requestAnimationFrame(render);

	for(var i=spheres.children.length-1;i>=0;i--){
		var sphere = spheres.children[i];
		var value = Math.round(Math.abs(noise.simplex3(sphere.org.x/100, sphere.org.z/100, a*0.0001))*10)/10;
		sphere.material.color = new THREE.Color("hsl("+(180-value*180)+",50%,50%)");
		sphere.position.y = value*18;
	}

	renderer.render(scene, camera);
}

init();
