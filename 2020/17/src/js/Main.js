// TODO: Three code and solution code should be modules that are loaded by main.

// TODO: Look into webpack/browserify to use events https://nodejs.org/dist/latest-v14.x/docs/api/events.html ?

// Find the latest version by visiting https://cdn.skypack.dev/three.

import * as THREE from 'https://cdn.skypack.dev/three@0.130.1';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.130.1/examples/jsm/controls/OrbitControls.js';

// TODO: All states are calculated on load. Consider a more dynamic approach using events

import { states as States, dimensionMinMax as MinMax } from './solution.mjs';
import { Coordinate } from './DataStructures.mjs';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.touches = {
	ONE: THREE.TOUCH.ROTATE,
	TWO: THREE.TOUCH.DOLLY_PAN
};
controls.enableDamping = true;

const geometry = new THREE.BoxGeometry(.5, .5, .5);

//scene.add(cube);

camera.position.z = 5;
//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function animate() {
	requestAnimationFrame(animate);

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render(scene, camera);
}
animate();

const materialActive = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
const materialInactive = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.015 });

// TODO: This is the cousin of Graph from DataStructures. Can we EXTEND it?
class CubeMap {
	constructor() {
		this.Cubes = new Map();
		// this.Min = new Coordinate();
		// this.Max = new Coordinate();
	}

	getCube(coordinate) {
		let cube = this.Cubes.get(coordinate.toKey());
		if (!cube) {
			cube = new THREE.Mesh(geometry, materialInactive);
			cube.position.set(coordinate.x, coordinate.y, coordinate.z);
			scene.add(cube);
			this.Cubes.set(coordinate.toKey(), cube);
		}

		return cube; // This is an existing or new cube THREE.Mesh
	}
}

const cubes = new CubeMap();

// Pass control - move to separate module

let fps = 1;

let cycle = 0;

let repeat = true;
let run = true; // TODO: maybe use something like this for start and stop ?

function doCycle() {
	console.log(cycle);
	console.log(States[cycle]); // Solution states
	console.log(MinMax[cycle]); // TODO: Might not need this if we use bounding box

if (repeat && cycle ===7){
	cubes.Cubes.forEach(cube => cube.material = materialInactive);
	cycle = 0;
}

	// Actually set the scene
	States[cycle].forEach(cubeState => {
		const cube = cubes.getCube(cubeState.coordinate);
		cube.material = cubeState.active ? materialActive : materialInactive;
	});

	if (cycle < 7) setTimeout(doCycle, 1000 / fps);
	cycle++;

}
doCycle();

const fpsSlider = document.getElementById("fps-slider");
fpsSlider.oninput = function () {
	console.log(fps);
	if (this.value !== null) fps = this.value;
};
