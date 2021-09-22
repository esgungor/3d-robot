import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

// Materials

const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xff0000);

// Mesh
// const sphere = new THREE.Mesh(geometry,material)
// scene.add(sphere)

// Lights
const hlight = new THREE.AmbientLight(0x404040, 100);
scene.add(hlight);
// const pointLight = new THREE.PointLight(0xffffff, 0.1);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
console.log(sizes.width);
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  40,
  sizes.width / sizes.height,
  0.01,
  5000
);
camera.position.z = 20;
camera.position.y = 2.5;
camera.rotation.x = -(40 / 180) * Math.PI;

// camera.rotation.z = (10 / 180) * Math.PI;

// camera.position.x = 700;
// camera.position.z = 10;
// camera.position.x = -8;
// camera.position.y = -11;

// camera.position.y = -200;
// camera.position.x = 0;
// camera.position.y = 0;
// camera.position.z = 2;
scene.add(camera);
// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.5, 0);
controls.update();

const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.background = new THREE.Color(0xddddd);
scene.background = new THREE.Color(0xeeeeee);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;
scene.fog = new THREE.Fog(0xeeeeee, 10, 50);

const grid = new THREE.GridHelper(100, 40, 0x000000, 0x000000);
grid.material.opacity = 0.1;
grid.material.depthWrite = false;
grid.material.transparent = true;
scene.add(grid);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 100);
// directionalLight.position.set(0, 1, 0);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

// const light = new THREE.PointLight(0xc4c4c4, 10);
// light.position.set(0, 300, 500);
// scene.add(light);

// const light2 = new THREE.PointLight(0xc4c4c4, 10);
// light2.position.set(500, 100, 0);
// scene.add(light2);

// const light3 = new THREE.PointLight(0xc4c4c4, 10);
// light3.position.set(0, 100, -500);
// scene.add(light3);

// const light4 = new THREE.PointLight(0xc4c4c4, 10);
// light4.position.set(-500, 300, 500);
// scene.add(light4);
/* Materials*/
const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 0.6,
  roughness: 0.4,
  clearcoat: 0.05,
  clearcoatRoughness: 0.05,
});

const detailsMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1.0,
  roughness: 0.5,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0.1,
  transmission: 0.9,
  transparent: true,
});

// const bodyColorInput = document.getElementById("body-color");
// bodyColorInput.addEventListener("input", function () {
//   bodyMaterial.color.set(this.value);
// });

// const detailsColorInput = document.getElementById("details-color");
// detailsColorInput.addEventListener("input", function () {
//   detailsMaterial.color.set(this.value);
// });

// const glassColorInput = document.getElementById("glass-color");
// glassColorInput.addEventListener("input", function () {
//   glassMaterial.color.set(this.value);
// });

// Car

const shadow = new THREE.TextureLoader().load("gltf/ferrari_ao.png");

/**
 * Animate
 */
console.log(camera.position);
let loader = new GLTFLoader();
let myCar;
let test;
let wheels = [];
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath("draco/gltf/");
// loader.setDRACOLoader(dracoLoader);

loader.load("gltf/last_change.gltf", (gltf) => {
  myCar = gltf.scene.children[0];

  // myCar.getObjectByName("body").material = bodyMaterial;
  // myCar.getObjectByName("rim_fl").material = detailsMaterial;
  // myCar.getObjectByName("rim_fr").material = detailsMaterial;
  // myCar.getObjectByName("rim_rr").material = detailsMaterial;
  // myCar.getObjectByName("rim_rl").material = detailsMaterial;
  // myCar.getObjectByName("trim").material = detailsMaterial;
  wheels.push(
    myCar.getObjectByName("Cylinder007"),
    myCar.getObjectByName("Cylinder011"),
    myCar.getObjectByName("Cylinder013"),
    myCar.getObjectByName("Plane036").getObjectByName("Cylinder012")
  );
  // myCar.getObjectByName("glass").material = glassMaterial;
  console.log(wheels);
  // myCar.scale.set(10, 10, 10);
  //   myCar.position.x = 0;

  //   myCar.position.z = 0;

  console.log(gltf.scene.children[0]);
  scene.add(gltf.scene);
});
let throttle = 0.01;
let counter = 0;
console.log(myCar);
document.addEventListener(
  "keydown",
  (e) => {
    console.log(e.code);

    let keyCode = e.code;
    const time = -performance.now() / 1000;
    if (keyCode === "KeyF") {
      throttle *= 5;
    }
    if (keyCode === "KeyR") {
      throttle = 0.01;
      counter = 0;
    }
    if (keyCode === "ArrowUp") {
      if (throttle < 0.5 && counter === 20) {
        throttle *= 3;
        counter = 0;
      } else if (throttle < 1) {
        counter += 1;
      }
      console.log(wheels);
      grid.position.z -= throttle;

      for (let i = 0; i < wheels.length; i++) {
        wheels[i].rotation.x += throttle;
      }
    }
    if (keyCode === "ArrowDown") {
      grid.position.z += throttle;
      for (let i = 0; i < wheels.length; i++) {
        wheels[i].rotation.x -= throttle;
      }
    }
  },
  false
);

function animate() {
  // for (let i = 0; i < wheels.length; i++) {
  //   console.log(wheels[i].rotation);
  // }
  //   if (myCar) myCar.position.x += 1;
  // if (myCar) myCar.rotation.z += 0.01;
  //   myCar.position.z += 1;
  // camera.position.z += 1;

  //   camera.position.x += 0.01;
  //   camera.rotation.y += 0.01;
  //   camera.rotation.z += 0.01;

  //   console.log(camera.position);
  //   myCar.position.x += 1;

  requestAnimationFrame(animate);
  //   car.position.x += 0.1;

  renderer.render(scene, camera);
}
animate();

// const clock = new THREE.Clock();

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();

//   // Update objects
//   sphere.rotation.y = 0.5 * elapsedTime;

//   // Update Orbital Controls
//   // controls.update()

//   // Render
//   renderer.render(scene, camera);

//   // Call tick again on the next frame
//   window.requestAnimationFrame(tick);
// };

// tick();
