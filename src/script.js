import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as dat from "dat.gui";
import dom from "dat.gui/src/dat/dom/dom";
import { getAcc, getGamepadState } from "./gamepad";
import "./style.scss";
import "./custom.scss";
// import "@popperjs/core/dist/umd/popper.min.js";

import "bootstrap/js/dist/collapse";

import RoboController from "./ros";
import { createEvent } from "./events";
import RobotStatus from "./robotStatus";
import { getTopics } from "./topic";
import VirtualJoystick, {
  createJoystick,
  getJoystickState,
  mouseDownHandler,
  mouseUpHandler,
  move,
} from "./virtualJoystick";

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

const lineMaterial = new THREE.LineDashedMaterial({
  color: 0xe3e3e4,
});
const line = new THREE.Line(lineGeometry, lineMaterial);
line.geometry.computeBoundingSphere();
line.frustumCulled = false;

var positions = line.geometry.attributes.position.array;

scene.add(line);
window.addEventListener("resize", onWindowResize);
// Materials
const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xff0000);

// Lights
const hlight = new THREE.AmbientLight(0x404040, 10);
scene.add(hlight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
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

// camera.position.z = 2;
scene.add(camera);
// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

const pmremGenerator = new THREE.PMREMGenerator(renderer);
// scene.background = new THREE.Color(0xddddd);
// scene.background = new THREE.Color(0xeeeeee);

//Old theme given
// scene.background = new THREE.Color(0x24383f);
scene.background = new THREE.Color(0x1d2224);

scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;
// scene.fog = new THREE.Fog(0xeeeeee, 10, 50);

const grid = new THREE.GridHelper(100, 40, 0xffffff, 0xffffff);
// const grid = new THREE.GridHelper(100, 40, 0x000000, 0x000000);

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

let loader = new GLTFLoader();
let myRobot;
let myRobotTop;
let myRobotTopGun;
let myRobotDown;
let wheels = [];

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
createJoystick();
let rightJoystickInner = document.getElementById("right-inner");

rightJoystickInner.addEventListener("mousedown", mouseDownHandler);
// miniDom2.addEventListener("mousedown", cameraMouseDownHandler);

// miniDom.addEventListener("touchstart", mouseDownHandler);

// miniDom2.addEventListener("touchstart", cameraMouseDownHandler);

let currentPos = { x: 0, y: 0 };

document.addEventListener("mousemove", move);
// vj.rightJoystickInner.addEventListener("touchmove", move);

document.addEventListener("mouseup", mouseUpHandler);
// vj.rightJoystickInner.addEventListener("touchend", mouseUpHandler);
const colorOuter = "rgba(200, 205, 207, 0.2)";
const colorInner = "rgba(200, 205, 207, 0.8)";

// const domElement = document.createElement("div");
// document.body.append(domElement);
// domElement.style.zIndex = 1000000;
// domElement.style.position = "fixed";
// domElement.style.bottom = "60px";
// domElement.style.right = "60px";
// domElement.style.backgroundColor = colorOuter;
// domElement.style.borderRadius = "99px";
// domElement.style.width = "150px";
// domElement.style.height = "150px";

// const miniDom = document.createElement("div");
// document.body.append(domElement);
// miniDom.style.zIndex = 1000;
// miniDom.style.position = "relative";
// miniDom.style.top = "24%";
// miniDom.style.translate = "translateY(-50%)";
// miniDom.style.margin = "auto";
// miniDom.style.backgroundColor = colorInner;
// miniDom.style.borderRadius = "99px";
// miniDom.style.width = "80px";
// miniDom.style.height = "80px";

const fullscreen = document.getElementById("fullscreen");
const minimize = document.getElementById("minimize");

const cameraScreen = document.getElementsByClassName("camera");

fullscreen.onclick = () => {
  cameraScreen[0].style.height = "100vh";
  cameraScreen[0].style.bottom = "0px";
  cameraScreen[0].style.left = "0px";

  cameraScreen[0].style.width = "100vw";
  fullscreen.style.display = "none";
  minimize.style.display = "block";
};

minimize.onclick = () => {
  cameraScreen[0].style.height = "200px";
  cameraScreen[0].style.width = "300px";

  cameraScreen[0].style.bottom = "10px";
  cameraScreen[0].style.left = "10px";
  fullscreen.style.display = "block";
  minimize.style.display = "none";
};

// const positionDomElement = document.createElement("div");
// document.body.append(domElement);
// positionDomElement.style.zIndex = 10000000;
// positionDomElement.style.position = "fixed";
// positionDomElement.style.bottom = "60px";
// positionDomElement.style.left = "60px";
// positionDomElement.style.backgroundColor = colorOuter;
// positionDomElement.style.borderRadius = "99px";
// positionDomElement.style.width = "150px";
// positionDomElement.style.height = "150px";

// const miniDom2 = document.createElement("div");
// document.body.append(positionDomElement);
// miniDom2.style.zIndex = 100000;
// miniDom2.style.position = "relative";
// miniDom2.style.top = "24%";
// miniDom2.style.translate = "translateY(-50%)";
// miniDom2.style.margin = "auto";
// miniDom2.style.backgroundColor = colorInner;
// miniDom2.style.borderRadius = "99px";
// miniDom2.style.width = "80px";
// miniDom2.style.height = "80px";

// domElement.appendChild(miniDom);
// positionDomElement.appendChild(miniDom2);

// const angleMove = (e) => {
//   let xDiff = 0;
//   let yDiff = 0;
//   if (dragStart2 === null) return;

//   if (e.changedTouches) {
//     console.log("touchscreen clicked");

//     xDiff = e.changedTouches[0].clientX - dragStart2.x;
//     yDiff = e.changedTouches[0].clientY - dragStart2.y;
//   } else {
//     xDiff = e.clientX - dragStart2.x;
//     yDiff = e.clientY - dragStart2.y;
//   }
//   e.preventDefault();

//   const newAngle = Math.atan2(yDiff, xDiff);
//   const newDistance = Math.min(maxDiff, Math.hypot(xDiff, yDiff));
//   const multiX = newDistance * Math.cos(newAngle);
//   const multiY = newDistance * Math.sin(newAngle);
//   cameraPos = {
//     x: multiX,
//     y: multiY,
//   };
//   miniDom2.style.transform = `translate3d(${multiX}px, 0px, 0px)`;
// };

// const move = (e) => {
//   if (dragStart === null) return;
//   e.preventDefault();

//   miniDom.style.transition = ".0s";
//   let xDiff = 0;
//   let yDiff = 0;

//   if (e.changedTouches) {
//     xDiff = e.changedTouches[0].clientX - dragStart.x;
//     yDiff = e.changedTouches[0].clientY - dragStart.y;
//   } else {
//     xDiff = e.clientX - dragStart.x;
//     yDiff = e.clientY - dragStart.y;
//   }

//   const angle = Math.atan2(yDiff, xDiff);
//   const distance = Math.min(maxDiff, Math.hypot(xDiff, yDiff));
//   const xNew = distance * Math.cos(angle);
//   const yNew = distance * Math.sin(angle);

//   miniDom.style.transform = `translate3d(${xNew}px, ${yNew}px, 0px)`;

//   currentPos = {
//     x: xNew,
//     y: yNew,
//   };
// };

// const mouseDownHandler = (e) => {
//   console.log("Triggered");
//   e.preventDefault();
//   dragStop = false;
//   moveFlag = true;

//   miniDom.style.transition = ".0s";
//   if (e.changedTouches) {
//     console.log("touchscreen clicked");

//     dragStart = {
//       x: e.changedTouches[0].clientX,
//       y: e.changedTouches[0].clientY,
//     };
//   } else {
//     dragStart = {
//       x: e.clientX,
//       y: e.clientY,
//     };
//   }
// };

// const cameraMouseDownHandler = (e) => {
//   isCameraMove = true;
//   dragStop = false;
//   moveFlag = true;

//   e.preventDefault();
//   // miniDom2.style.transition = ".0s";
//   if (e.changedTouches) {
//     console.log("touchscreen clicked");

//     dragStart2 = {
//       x: e.changedTouches[0].clientX,
//       y: e.changedTouches[0].clientY,
//     };
//   } else {
//     dragStart2 = {
//       x: e.clientX,
//       y: e.clientY,
//     };
//   }
// };
// let dragStop = true;
// const mouseUpHandler = (e) => {
//   if (dragStart === null) return;

//   miniDom.style.transition = ".2s";
//   miniDom.style.transform = `translate3d(0px, 0px, 0px)`;

//   dragStart = null;
//   dragStop = true;
//   currentPos = { x: 0, y: 0 };
// };

// const angleMouseUpHandler = (e) => {
//   e.preventDefault();

//   if (dragStart2 === null) return;
//   miniDom2.style.transition = ".2s";
//   miniDom2.style.transform = `translate3d(0px, 0px, 0px)`;
//   dragStart2 = null;
//   dragStop = true;

//   cameraPos = { x: 0, y: 0 };
// };

// // miniDom.style.transform = "translate (-50%,-50%)";
// let dragStart = null;
// let dragStart2 = null;

// miniDom.addEventListener("mousedown", mouseDownHandler);
// miniDom2.addEventListener("mousedown", cameraMouseDownHandler);

// miniDom.addEventListener("touchstart", mouseDownHandler);

// miniDom2.addEventListener("touchstart", cameraMouseDownHandler);

// let currentPos = { x: 0, y: 0 };

// document.addEventListener("mousemove", move);
// miniDom.addEventListener("touchmove", move);
// document.addEventListener("mousemove", angleMove);
// miniDom2.addEventListener("touchmove", angleMove);

// document.addEventListener("mouseup", mouseUpHandler);
// miniDom.addEventListener("touchend", mouseUpHandler);
// document.addEventListener("mouseup", angleMouseUpHandler);
// miniDom2.addEventListener("touchend", angleMouseUpHandler);

/*


*/

var ros = new ROSLIB.Ros({
  url: "ws://192.168.50.25:9090",
});

ros.on("error", () => {
  createEvent("Connection Error", "ROS Bridge connection has failed.");
});
ros.on("connection", () => {
  createEvent("Connection Successful", "ROS Bridge connected");
});

var img = document.getElementById("test");

// ROS Listeners defined in here!!
let {
  listener,
  chassis,
  gimbal,
  position,
  attitude,
  imu,
  status,
  battery,
  gimbalRead,
} = getTopics(ros);
let testX = 0;

let degree = {
  linearX: 0,
  angularX: 0,
  stopSpeedChasis: 0,
  pitch_angle: 0,
  yaw_angle: 0,
  stopSpeedGimbal: 0,
};
let chassisNew = new ROSLIB.Topic({
  ros: ros,
  name: "/robomaster/chassis",
  messageType: "geometry_msgs/Twist",
});
const robot = new RoboController();
setInterval(() => {
  degree = getGamepadState();
  // let joystick = getJoystickState();
  // console.log(joystick);
  // degree.linearX = joystick.x / 100;
  // degree.angularX = joystick.y / 10;
  if (degree !== undefined || null) {
    if (degree.angularX !== 0 || degree.linearX !== 0) {
      robot.setPositionX(degree.linearX);
      robot.setAngularX(degree.angularX);
      robot.publishPosition(chassis);

      getAcc(degree.linearX, degree.angularX);

      degree.angularX = 0;
      degree.linearX = 0;
    }

    if (degree.pitch_angle !== 0 || degree.yaw_angle !== 0) {
      robot.setGimbal(degree.pitch_angle);
      robot.setGimbalAngular(degree.yaw_angle);
      robot.publishGimbal(gimbal);
    }
    if (degree.stopSpeedChasis === 1) {
      getAcc(degree.linearX, degree.angularX);

      robot.stopMove(chassis);
      degree.stopSpeedChasis = 0;
    }
    if (degree.stopSpeedGimbal === 1) {
      robot.stopMove(gimbal);
      degree.stopSpeedGimbal = 0;
    }
  }
}, 100);

// let moveFlag = false;
// setInterval(() => {
//   var chasis = new ROSLIB.Message({
//     linear: {
//       x: (-1 * currentPos.y) / 200,
//       y: 0.0,
//       z: 0.0,
//     },
//     angular: {
//       x: (-1 * cameraPos.x) / 2,
//       y: 0.0,
//       z: 0.0,
//     },
//   });
//   let gimbalBase = {
//     linear: {
//       x: 0.0,
//       y: 0.0,
//       z: 0.0,
//     },
//     angular: {
//       x: 0.0,
//       y: 0.0,
//       z: 0.0,
//     },
//   };
//   var gimbalData = new ROSLIB.Message({
//     linear: {
//       x: degree.yaw_angle * 10,
//       y: 0.0,
//       z: 0.0,
//     },
//     angular: {
//       x: degree.pitch_angle * 10,
//       y: 0.0,
//       z: 0.0,
//     },
//   });
//   if (
//     (degree && degree.stopSpeedChasis !== 1,
//     currentPos.y !== 0 ||
//       (cameraPos.x !== 0 && (degree.angularX !== 0 || degree.linearX !== 0)))
//   ) {
//     moveFlag = true;
//     chassis.publish(chasis);
//   } else if (moveFlag && degree && degree.stopSpeedChasis === 1) {
//     degree.stopSpeedChasis = 0;
//     chasis.linear.x = 0;
//     chasis.angular.x = 0;

//     chassis.publish(chasis);

//     moveFlag = false;
//   }

//   if (
//     (degree && degree.stopSpeedGimbal !== 1,
//     degree.yaw_angle !== 0 || degree.pitch_angle !== 0)
//   ) {
//     moveFlag = true;
//     gimbalBase.linear.x += degree.yaw_angle * 50;
//     gimbalBase.angular.x += degree.pitch_angle * 50;

//     gimbal.publish(new ROSLIB.Message(gimbalBase));
//   } else if (moveFlag && degree && degree.stopSpeedGimbal === 1) {
//     gimbalData.linear.x = 0;
//     gimbalData.angular.x = 0;
//     gimbal.publish(gimbalData);

//     moveFlag = false;
//   }
// }, 100);

// setInterval(() => {
//   let gimbalBase = {
//     linear: {
//       x: 0.0,
//       y: 0.0,
//       z: 0.0,
//     },
//     angular: {
//       x: 0.0,
//       y: 0.0,
//       z: 0.0,
//     },
//   };
//   var gimbalData = new ROSLIB.Message({
//     linear: {
//       x: degree.yaw_angle * 10,
//       y: 0.0,
//       z: 0.0,
//     },
//     angular: {
//       x: degree.pitch_angle * 10,
//       y: 0.0,
//       z: 0.0,
//     },
//   });

//   if (
//     (degree && degree.stopSpeedGimbal !== 1,
//     degree.yaw_angle !== 0 || degree.pitch_angle !== 0)
//   ) {
//     moveFlag = true;
//     gimbalBase.linear.x += degree.yaw_angle * 50;
//     gimbalBase.angular.x += degree.pitch_angle * 50;

//     gimbal.publish(new ROSLIB.Message(gimbalBase));
//   } else if (moveFlag && degree && degree.stopSpeedGimbal === 1) {
//     gimbalData.linear.x = 0;
//     gimbalData.angular.x = 0;
//     gimbal.publish(gimbalData);

//     moveFlag = false;
//   }
// }, 100);

// ONLY FOR TESTING PURPOSES
const robotData = new RobotStatus();
robotData.battery = 65;
robotData.publishBattery("battery-data");

listener.subscribe(function (message) {
  img.src = `data:image/jpeg;base64,${message.data}`;
});

robotData.setPositionString("(1.44131, 0.0271, 0.0)");
robotData.setImuString(
  "(0.02131, 0.00574, -1.00938, -0.00654, -0.00937, 0.0098)"
);

robotData.setAttitudeString("(1.0, 1.0, 1.0)");
robotData.setGimbalStatusString("(15.6, 52.4, 17.3, 52.4)");
robotData.publishImu("imu");
imu.subscribe(function (message) {
  console.log(message.data);
  robotData.setImuString(message.data);
  robotData.publishImu("imu");
});
attitude.subscribe(function (message) {
  robotData.setAttitudeString(message.data);
  robotData.publishAttitude("attitude");
});
battery.subscribe(function (message) {
  robotData.setBattery(message.data);
  robotData.publishBattery("battery-data");
});
position.subscribe(function (message) {
  robotData.setPositionString(message.data);
  robotData.publishPosition("position");
});
gimbalRead.subscribe(function (message) {
  robotData.setGimbalStatusString(message.data);
  robotData.publishGimbalRead("gimbal-angle");
});

// attitude.subscribe((message) => {
//   robotData.setPositionString(message);
//   robotData.publishPosition("chassis");
// });
// robotData.publishPosition("chassis");

let lineCounter = 2;

let samplingCounter = 0;

// let degree = {
//   linearX: 0,
//   angularX: 0,
//   stopSpeedChasis: 0,
//   pitch_angle: 0,
//   yaw_angle: 0,
//   stopSpeedGimbal: 0,
// };
// let tempDegree = {
//   linearX: 0,
//   angularX: 0,
//   stopSpeedChasis: 0,
//   pitch_angle: 0,
//   yaw_angle: 0,
//   stopSpeedGimbal: 0,
// };
// setInterval(() => {
//   tempDegree = getGamepadState();
// }, 100);
function animate() {
  if (myRobot && degree) {
    if (myRobot.rotation.y >= 2 * Math.PI) {
      myRobot.rotation.y = myRobot.rotation.y - 2 * Math.PI;
    }
    if (myRobot.rotation.y < 0) {
      myRobot.rotation.y = myRobot.rotation.y + 2 * Math.PI;
    }
    myRobot.rotation.y += robot.positionAngularX / 100;

    myRobot.position.z +=
      (Math.cos(myRobot.rotation.y) * (-1 * robot.positionX)) / 10;
    myRobot.position.x +=
      (Math.sin(myRobot.rotation.y) * (-1 * robot.positionX)) / 10;
    camera.position.z +=
      (Math.cos(myRobot.rotation.y) * (-1 * robot.positionX)) / 10;
    camera.position.x +=
      (Math.sin(myRobot.rotation.y) * (-1 * robot.positionX)) / 10;

    for (let i = 0; i < wheels.length; i++) {
      wheels[i].rotation.x += Math.abs(robot.positionAngularX / 10);
      wheels[i].rotation.x += Math.abs(robot.positionX / 10);
    }
    if (positions)
      positions[lineCounter * 3 - 1] +=
        (Math.cos(myRobot.rotation.y) * (-1 * robot.positionX)) / 10;
    if (positions)
      positions[lineCounter * 3 - 3] +=
        (Math.sin(myRobot.rotation.y) * (-1 * robot.positionX)) / 10;
    if (robot.angularX !== 0) samplingCounter++;
    if (robot.angularX !== 0 && samplingCounter === 30) {
      lineGeometry.setDrawRange(0, lineCounter + 1);
      lineCounter += 1;

      positions[lineCounter * 3 - 1] += positions[lineCounter * 3 - 1 - 3];
      positions[lineCounter * 3 - 3] += positions[lineCounter * 3 - 3 - 3];

      samplingCounter = 0;
    }
  }
  // if (tempDegree && tempDegree.linearX !== 0 && tempDegree.angularX !== 0) {
  //   degree = tempDegree;
  //   cameraPos.x = -1 * degree?.angularX * 100;

  //   currentPos.y = -1 * degree?.linearX * 100;
  // } else if (tempDegree && tempDegree.stopSpeedChasis) {
  //   degree.linearX = 0;
  //   degree.angularX = 0;
  //   cameraPos.x = -1 * degree?.angularX * 100;

  //   currentPos.y = -1 * degree?.linearX * 100;
  // }
  if (myRobotTopGun && degree) {
    myRobotTop.rotation.y += degree.pitch_angle / 100;

    if (
      (myRobotTopGun.rotation.x < Math.PI / 4 || degree.yaw_angle < 0) &&
      (myRobotTopGun.rotation.x > Math.PI / -6 || degree.yaw_angle > 0)
    )
      myRobotTopGun.rotation.x += degree.yaw_angle / 100;
  }

  // let alpha = 0;
  // if (myRobot) {
  //   if (currentPos.y < 50) {
  //     myRobot.rotation.y -= cameraPos.x / 10000;
  //   } else {
  //     myRobot.rotation.y += cameraPos.x / 10000;
  //   }

  //   alpha = myRobot.rotation.y;
  //   let condition = (myRobot.rotation.y * 180) / Math.PI;

  //   if (condition < 0) condition = 360 + condition;

  //   myRobot.position.z += (Math.cos(alpha) * currentPos.y) / 800;
  //   myRobot.position.x += (Math.sin(alpha) * currentPos.y) / 800;
  //   camera.position.x += (Math.sin(alpha) * currentPos.y) / 800;
  //   camera.position.z += (Math.cos(alpha) * currentPos.y) / 800;
  // }

  // for (let i = 0; i < wheels.length; i++) {
  //   wheels[i].rotation.x += currentPos.y / 800;
  //   wheels[i].rotation.x += cameraPos.x / 800;
  // }

  // if (positions)
  //   positions[lineCounter * 3 - 1] += (Math.cos(alpha) * currentPos.y) / 800;
  // if (positions)
  //   positions[lineCounter * 3 - 3] += (Math.sin(alpha) * currentPos.y) / 800;
  // if (cameraPos.x !== 0) samplingCounter++;
  // if (cameraPos.x !== 0 && samplingCounter === 30) {
  //   lineGeometry.setDrawRange(0, lineCounter + 1);
  //   lineCounter += 1;

  //   positions[lineCounter * 3 - 1] += positions[lineCounter * 3 - 1 - 3];
  //   positions[lineCounter * 3 - 3] += positions[lineCounter * 3 - 3 - 3];

  //   samplingCounter = 0;
  // }

  line.geometry.attributes.position.needsUpdate = true; // required after the first render

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
animate();
