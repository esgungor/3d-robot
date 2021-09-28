import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as dat from "dat.gui";
import dom from "dat.gui/src/dat/dom/dom";
import { getGamepadState } from "./gamepad";

//Map

// Debug
// const gui = new dat.GUI();
const maxDiff = 100;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

//line

// let positions;

const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setDrawRange(0, 2);
var positions = new Float32Array(500 * 3); // 3 vertices per point

lineGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const lineMaterial = new THREE.LineDashedMaterial({ color: 0xff0000 });
const line = new THREE.Line(lineGeometry, lineMaterial);
line.geometry.computeBoundingSphere();
line.frustumCulled = false;

var positions = line.geometry.attributes.position.array;

console.log(line.geometry.attributes.position);

scene.add(line);

// Materials
const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xff0000);

// Mesh
// const sphere = new THREE.Mesh(geometry,material)
// scene.add(sphere)

// Lights
const hlight = new THREE.AmbientLight(0x404040, 10);
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
camera.position.z = 10;
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
controls.target.set(0, 0, 0);
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

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

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

console.log(camera.position);
let loader = new GLTFLoader();
let myRobot;
let myRobotTop;
let myRobotTopGun;
let myRobotDown;

let robotWheels = [];
let myCar;
let test;
let newTest;
let wheels = [];
let cameraPos = { x: 0, y: 0 };

loader.load("gltf/parent.gltf", (gltf) => {
  myRobot = gltf.scene.children[0];
  myRobot.scale.set(0.5, 0.5, 0.5);
  myRobotTop = myRobot.getObjectByName("node_id6");
  myRobotTopGun = myRobotTop.getObjectByName("node_id8");

  myRobotDown = myRobot.getObjectByName("node_id57");
  myRobot.position.y -= 0.5;
  wheels.push(
    myRobotDown.getObjectByName("node_id197").getObjectByName("node_id214"),

    myRobotDown.getObjectByName("node_id197").getObjectByName("node_id229"),
    myRobotDown.getObjectByName("node_id62"),
    myRobotDown.getObjectByName("node_id244")
  );

  scene.add(gltf.scene);
});
let counter = 0;

document.addEventListener("keyup", (e) => {
  console.log(e.code);
  if (e.code === "ArrowUp" || e.code === "ArrowDown") {
    throttle = 0.01;
    counter = 0;
  }
});
document.addEventListener(
  "keydown",
  (e) => {
    let keyCode = e.code;

    if (keyCode === "ArrowUp") {
      console.log(wheels);
      grid.position.z -= throttle;

      for (let i = 0; i < wheels.length; i++) {
        wheels[i].rotation.x += throttle;
      }
    }
    if (keyCode === "ArrowDown") {
      if (throttle < 0.5 && counter === 20) {
        throttle *= 3;
        counter = 0;
      } else if (throttle < 1) {
        counter += 1;
      }
      grid.position.z += throttle;
      for (let i = 0; i < wheels.length; i++) {
        wheels[i].rotation.x -= throttle;
      }
    }
    if (keyCode === "ArrowRight") {
      console.log(wheels);
      if (throttle < 0.5 && counter === 20) {
        throttle *= 3;
        counter = 0;
      } else if (throttle < 1) {
        counter += 1;
      }
      grid.position.x += throttle;
    }
    if (keyCode === "ArrowLeft") {
      console.log(wheels);
      if (throttle < 0.5 && counter === 20) {
        throttle *= 3;
        counter = 0;
      } else if (throttle < 1) {
        counter += 1;
      }
      grid.position.x -= throttle;
    }
  },
  false
);

document.addEventListener(
  "keydown",
  (e) => {
    let keyCode = e.code;
  },
  false
);

const domElement = document.createElement("div");
document.body.append(domElement);
domElement.style.zIndex = 100;
domElement.style.position = "fixed";
domElement.style.bottom = "60px";
domElement.style.right = "60px";
domElement.style.backgroundColor = "rgba(0,0,0,0.2)";
domElement.style.borderRadius = "99px";
domElement.style.width = "200px";
domElement.style.height = "200px";

const miniDom = document.createElement("div");
document.body.append(domElement);
miniDom.style.zIndex = 1000;
miniDom.style.position = "relative";
miniDom.style.top = "25%";
miniDom.style.translate = "translateY(-50%)";
miniDom.style.margin = "auto";
miniDom.style.backgroundColor = "rgba(0,0,0,0.6)";
miniDom.style.borderRadius = "99px";
miniDom.style.width = "100px";
miniDom.style.height = "100px";

const fullscreen = document.getElementsByClassName("fullscreen");
const minimize = document.getElementsByClassName("minimize");

const cameraScreen = document.getElementsByClassName("camera");

fullscreen[0].onclick = () => {
  cameraScreen[0].style.height = "100vh";
  cameraScreen[0].style.bottom = "0px";
  cameraScreen[0].style.left = "0px";

  cameraScreen[0].style.width = "100vw";
};

minimize[0].onclick = () => {
  cameraScreen[0].style.height = "200px";
  cameraScreen[0].style.width = "300px";

  cameraScreen[0].style.bottom = "10px";
  cameraScreen[0].style.left = "10px";
};

const positionDomElement = document.createElement("div");
document.body.append(domElement);
positionDomElement.style.zIndex = 100;
positionDomElement.style.position = "fixed";
positionDomElement.style.bottom = "250px";
positionDomElement.style.left = "60px";
positionDomElement.style.backgroundColor = "rgba(0,0,0,0.2)";
positionDomElement.style.borderRadius = "99px";
positionDomElement.style.width = "200px";
positionDomElement.style.height = "200px";

const miniDom2 = document.createElement("div");
document.body.append(positionDomElement);
miniDom2.style.zIndex = 100000;
miniDom2.style.position = "relative";
miniDom2.style.top = "25%";
miniDom2.style.translate = "translateY(-50%)";
miniDom2.style.margin = "auto";
miniDom2.style.backgroundColor = "rgba(0,0,0,0.6)";
miniDom2.style.borderRadius = "99px";
miniDom2.style.width = "100px";
miniDom2.style.height = "100px";

domElement.appendChild(miniDom);
positionDomElement.appendChild(miniDom2);
let isCameraMove = false;

const angleMove = (e) => {
  let xDiff = 0;
  let yDiff = 0;
  if (dragStart2 === null) return;

  if (e.changedTouches) {
    console.log("touchscreen clicked");

    xDiff = e.changedTouches[0].clientX - dragStart2.x;
    yDiff = e.changedTouches[0].clientY - dragStart2.y;
  } else {
    xDiff = e.clientX - dragStart2.x;
    yDiff = e.clientY - dragStart2.y;
  }
  e.preventDefault();

  const newAngle = Math.atan2(yDiff, xDiff);
  const newDistance = Math.min(maxDiff, Math.hypot(xDiff, yDiff));
  const multiX = newDistance * Math.cos(newAngle);
  const multiY = newDistance * Math.sin(newAngle);
  cameraPos = {
    x: multiX,
    y: multiY,
  };
  miniDom2.style.transform = `translate3d(${multiX}px, 0px, 0px)`;
};

const move = (e) => {
  if (dragStart === null) return;
  e.preventDefault();

  miniDom.style.transition = ".0s";
  let xDiff = 0;
  let yDiff = 0;

  if (e.changedTouches) {
    xDiff = e.changedTouches[0].clientX - dragStart.x;
    yDiff = e.changedTouches[0].clientY - dragStart.y;
  } else {
    xDiff = e.clientX - dragStart.x;
    yDiff = e.clientY - dragStart.y;
  }

  const angle = Math.atan2(yDiff, xDiff);
  const distance = Math.min(maxDiff, Math.hypot(xDiff, yDiff));
  const xNew = distance * Math.cos(angle);
  const yNew = distance * Math.sin(angle);

  miniDom.style.transform = `translate3d(${xNew}px, ${yNew}px, 0px)`;

  currentPos = {
    x: xNew,
    y: yNew,
  };
};

const mouseDownHandler = (e) => {
  console.log("Triggered");
  e.preventDefault();

  miniDom.style.transition = ".0s";
  if (e.changedTouches) {
    console.log("touchscreen clicked");

    dragStart = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
  } else {
    dragStart = {
      x: e.clientX,
      y: e.clientY,
    };
  }
};

const cameraMouseDownHandler = (e) => {
  isCameraMove = true;
  e.preventDefault();
  // miniDom2.style.transition = ".0s";
  if (e.changedTouches) {
    console.log("touchscreen clicked");

    dragStart2 = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
  } else {
    dragStart2 = {
      x: e.clientX,
      y: e.clientY,
    };
  }
};

const mouseUpHandler = (e) => {
  if (dragStart === null) return;

  miniDom.style.transition = ".2s";
  miniDom.style.transform = `translate3d(0px, 0px, 0px)`;

  dragStart = null;
  currentPos = { x: 0, y: 0 };
};

const angleMouseUpHandler = (e) => {
  e.preventDefault();

  if (dragStart2 === null) return;
  miniDom2.style.transition = ".2s";
  miniDom2.style.transform = `translate3d(0px, 0px, 0px)`;
  dragStart2 = null;
  cameraPos = { x: 0, y: 0 };
};

// miniDom.style.transform = "translate (-50%,-50%)";
let dragStart = null;
let dragStart2 = null;

miniDom.addEventListener("mousedown", mouseDownHandler);
miniDom2.addEventListener("mousedown", cameraMouseDownHandler);

miniDom.addEventListener("touchstart", mouseDownHandler);

miniDom2.addEventListener("touchstart", cameraMouseDownHandler);

let currentPos = { x: 0, y: 0 };

document.addEventListener("mousemove", move);
miniDom.addEventListener("touchmove", move);
document.addEventListener("mousemove", angleMove);
miniDom2.addEventListener("touchmove", angleMove);

document.addEventListener("mouseup", mouseUpHandler);
miniDom.addEventListener("touchend", mouseUpHandler);
document.addEventListener("mouseup", angleMouseUpHandler);
miniDom2.addEventListener("touchend", angleMouseUpHandler);

/*


*/
let lineCounter = 2;

let samplingCounter = 0;
const flag = false;

let degree = { linearX: 0, angularX: 0, pitch_angle: 0, yaw_angle: 0 };
let tempDegree = null;
setInterval(() => {
  tempDegree = getGamepadState();
}, 100);
function animate() {
  if (
    myRobotTopGun &&
    degree.pitch_angle !== undefined &&
    degree.yaw_angle !== undefined
  ) {
    console.log(myRobotTopGun.rotation.y);
    myRobotTop.rotation.y += degree.pitch_angle / 100;

    myRobotTopGun.rotation.x += degree.yaw_angle / 100;
  }
  if (tempDegree !== null && tempDegree !== undefined) {
    degree = tempDegree;

    // if (myRobot) {
    //   myRobot.position.z +=
    //     (-1 * degree?.linearX * (1 - -1 * myRobot.rotation.y)) / 50;
    //   if (myRobot.rotation.y < 6 && myRobot.rotation.y > -6)
    //     myRobot.rotation.y += degree?.angularX / 50;
    //   else myRobot.rotation.y = 0;
    //   myRobot.position.x += (degree?.linearX * -1 * myRobot.rotation.y) / 50;
    // }
  } else {
    degree.linearX = 0;
    degree.angularX = 0;
  }
  cameraPos.x = -1 * degree?.angularX * 100;

  currentPos.y = -1 * degree?.linearX * 100;
  let alpha = 0;
  // console.log(controls);
  // controls.update();
  if (myRobot) {
    if (currentPos.y < 50) {
      myRobot.rotation.y -= cameraPos.x / 10000;
    } else {
      myRobot.rotation.y += cameraPos.x / 10000;
    }

    alpha = myRobot.rotation.y;
    let condition = (myRobot.rotation.y * 180) / Math.PI;

    if (condition < 0) condition = 360 + condition;

    myRobot.position.z += (Math.cos(alpha) * currentPos.y) / 800;
    myRobot.position.x += (Math.sin(alpha) * currentPos.y) / 800;
    camera.position.x += (Math.sin(alpha) * currentPos.y) / 800;
    camera.position.z += (Math.cos(alpha) * currentPos.y) / 800;
  }

  for (let i = 0; i < wheels.length; i++) {
    wheels[i].rotation.x += currentPos.y / 800;
    wheels[i].rotation.x += cameraPos.x / 800;
  }

  if (positions)
    positions[lineCounter * 3 - 1] += (Math.cos(alpha) * currentPos.y) / 800;
  if (positions)
    positions[lineCounter * 3 - 3] += (Math.sin(alpha) * currentPos.y) / 800;
  if (cameraPos.x !== 0) samplingCounter++;
  if (cameraPos.x !== 0 && samplingCounter === 30) {
    lineGeometry.setDrawRange(0, lineCounter + 1);
    lineCounter += 1;

    positions[lineCounter * 3 - 1] += positions[lineCounter * 3 - 1 - 3];
    positions[lineCounter * 3 - 3] += positions[lineCounter * 3 - 3 - 3];

    // prevPos = currentPos.x;
    samplingCounter = 0;
  }

  line.geometry.attributes.position.needsUpdate = true; // required after the first render

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
animate();
