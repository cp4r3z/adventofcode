// TODO: Three code and solution code should be modules that are loaded by main.

// TODO: Look into webpack/browserify to use events https://nodejs.org/dist/latest-v14.x/docs/api/events.html ?

// Find the latest version by visiting https://cdn.skypack.dev/three.

import * as THREE from 'https://cdn.skypack.dev/three@0.130.1';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.130.1/examples/jsm/controls/OrbitControls.js';

import { states as States } from './solution.mjs'; // BROKEN, need to restructure project

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

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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

// Pass control - move to separate module

let fps = 1;

let pass = 0;

let run = true; // maybe use something like this for start and stop

function makePass() {
	console.log(pass);
	console.log(States[pass]); // Solution states
	if (pass < 6) setTimeout(makePass, 1000 / fps);
	pass++;
}
makePass();

const fpsSlider = document.getElementById("fps-slider");
fpsSlider.oninput = function () {
	console.log(fps);
	if (this.value !== null) fps = this.value;
};
