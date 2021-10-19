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
import { createChart, myChart } from "./chart";
const query = new URLSearchParams(window.location.search).get("socket");
const rosbridge_endpoint = query || "ws://192.168.50.25:9090";
console.log(rosbridge_endpoint);
//Map

// Debug
const maxDiff = 100;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

//line

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

grid.material.opacity = 0.2;
grid.material.depthWrite = false;
grid.material.transparent = true;
scene.add(grid);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

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

const colorOuter = "rgba(200, 205, 207, 0.2)";
const colorInner = "rgba(200, 205, 207, 0.8)";

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

const controllers = {
  NO_CONTROLLER: 0,
  GAMEPAD: 1,
  VIRTUAL: 2,
};

export const ros = new ROSLIB.Ros({
  url: rosbridge_endpoint,
});

ros.on("error", () => {
  createEvent(
    "Connection Error",
    `ROS Bridge connection has failed. Check bridge endpoint ${rosbridge_endpoint}`
  );
});
ros.on("connection", () => {
  createEvent(
    "Connection Successful",
    `ROS Bridge connected. Serving at ${rosbridge_endpoint}`
  );
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
  escSpeed,
  escAngle,
  escTimestamp,
  escStatus,
  rosbagReplay,
  rosbagSave,
  log,
  rosbagListTopic,
  rosbagTimeTopic,
} = getTopics(ros);
let testX = 0;

let degree = {
  linearX: 0,
  angularX: 0,
  linearY: 0,
  stopSpeedChasis: 0,
  pitch_angle: 0,
  yaw_angle: 0,
  stopSpeedGimbal: 0,
};
let saveData = "0";
let replayData = "0";
let inputData = "";
let rosbagName = "";
let input = document.getElementById("rosbag-name");
input.addEventListener("input", (e) => {
  rosbagName = e.target.value;
});

let logArea = document.getElementById("log");
log.subscribe(function (message) {
  console.log(message.data);
  logArea.innerHTML += `${message.data} <br />`;
});

const storedInputData = window.localStorage.getItem("rosbag-time");
if (storedInputData) {
  inputData = storedInputData;
  // createEvent("Stored Move", "Store move is detected!");
}
let stop = document.getElementById("rosbag-stop");
stop.addEventListener("click", () => {
  let recordMessage = new ROSLIB.Message({ data: `0, ${rosbagName}` });
  // let recordMessage = new ROSLIB.Message({ data: `0, ${inputData}` });

  rosbagSave.publish(recordMessage);
  stop.style.display = "none";
  save.style.display = "block";
  timerOn = false;
  startTime = undefined;
  timer.innerHTML = "";
  controller = controllers.GAMEPAD;
  dropdownSelect.innerHTML = "Gamepad";
  window.localStorage.setItem("rosbag-time", inputData);
  createEvent("ROSBAG", "State of the robot is saved!");
});

let timerOn = false;
let countdownOn = false;

let save = document.getElementById("rosbag-save");
save.addEventListener("click", () => {
  let recordMessage = new ROSLIB.Message({ data: `1, ${rosbagName}` });
  // let recordMessage = new ROSLIB.Message({ data: `1, ${inputData}` });
  console.log({ data: `1, ${rosbagName}` });
  rosbagSave.publish(recordMessage);
  stop.style.display = "block";
  save.style.display = "none";
  startTime = Date.now();
  timerOn = true;
});
let startTime = undefined;

let replay = document.getElementById("rosbag-replay");
replay.addEventListener("click", () => {
  console.log("testify");
  countdownOn = replayData = "1";
  let replayMessage = new ROSLIB.Message({ data: `1, ${selectedRosbag}` });
  console.log({ data: `1, ${selectedRosbag}` });
  controller = controllers.NO_CONTROLLER;
  dropdownSelect.innerHTML = "None";
  rosbagReplay.publish(replayMessage);
  startTime = Date.now();
  countdownOn = true;
});

let timer = document.getElementById("timer");
//Timer start
setInterval(() => {
  if (startTime) {
    let delta = robotData.rosTime - Math.floor((Date.now() - startTime) / 1000);
    console.log(robotData.selectedRosbag);
    timer.innerHTML = `${delta}`;
    if (delta <= 0) {
      startTime = undefined;
      timer.innerHTML = "";
    }
  }
  //To increase precision
}, 1000);

// setInterval(() => {
//   if (startTime) {
//     console.log("triggered!");
//     let delta = 0;
//     if (timerOn) {
//       delta = Math.floor((Date.now() - startTime) / 1000);
//       inputData = delta;
//       console.log(delta, "heyy");
//     } else if (countdownOn) {
//       delta = inputData - Math.floor((Date.now() - startTime) / 1000);
//     }

//     timer.innerHTML = `${delta}`;
//     console.log(delta);
//     timer.style.color = "red";
//     if (delta <= 0 && countdownOn) {
//       startTime = undefined;
//       timer.innerHTML = "";
//       controller = controllers.GAMEPAD;
//       dropdownSelect.innerHTML = "Gamepad";
//       countdownOn = false;
//     }
//   }
// }, 1000);

//Countdown
// setInterval(() => {
//   if (startTime) {
//     console.log("triggered!");
//     let delta = inputData - Math.floor((Date.now() - startTime) / 1000);
//     timer.innerHTML = `${delta}`;
//     timer.style.color = "red";
//     if (delta <= 0) {
//       startTime = undefined;
//       timer.innerHTML = "";
//       controller = controllers.GAMEPAD;
//       dropdownSelect.innerHTML = "Gamepad";
//     }
//   }
// }, 1000);

const robot = new RoboController();
let controller = controllers.NO_CONTROLLER;
createJoystick();

const virtualJoystick = document.getElementById("controller-virtual");
const noController = document.getElementById("controller-none");
const gamepadController = document.getElementById("controller-gamepad");
const velocity1x = document.getElementById("velocity-1x");
const velocity2x = document.getElementById("velocity-2x");
const velocity3x = document.getElementById("velocity-3x");
let multiplier = 0.5;
let dropdownVelocity = document.getElementById("dropdownMenuButton2");

export const increaseMultiplier = () => {
  if (multiplier >= 8) return;
  multiplier *= 2;
  dropdownVelocity.innerHTML = `${multiplier * 2}X`;
};

export const decreaseMultiplier = () => {
  if (multiplier <= 0.255) return;

  multiplier /= 2;
  dropdownVelocity.innerHTML = `${multiplier * 2}X`;
};
velocity1x.addEventListener("click", () => {
  multiplier = 0.5;
  dropdownVelocity.innerHTML = "1X";
});

velocity2x.addEventListener("click", () => {
  multiplier = 1;
  dropdownVelocity.innerHTML = "2X";
});

velocity3x.addEventListener("click", () => {
  multiplier = 2;
  dropdownVelocity.innerHTML = "3X";
});
let dropdownSelect = document.getElementById("dropdownMenuButton1");
virtualJoystick.addEventListener("click", function () {
  controller = controllers.VIRTUAL;
  dropdownSelect.innerHTML = "Virtual Joystick";
  if (controller === controllers.VIRTUAL) {
    let rightJoystickInner = document.getElementById("right-inner");
    rightJoystickInner.addEventListener("mousedown", mouseDownHandler);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", mouseUpHandler);
  }
});

noController.addEventListener("click", function () {
  controller = controllers.NO_CONTROLLER;
  dropdownSelect.innerHTML = "None";
});

gamepadController.addEventListener("click", function () {
  controller = controllers.GAMEPAD;
  dropdownSelect.innerHTML = "Gamepad";
});
setInterval(() => {
  switch (controller) {
    case controllers.NO_CONTROLLER:
      degree = undefined;
      return;
    case controllers.GAMEPAD:
      degree = getGamepadState();
      break;
    case controllers.VIRTUAL:
      let { x, y, stopSpeedChasis } = getJoystickState();

      degree = {
        linearX: (-1 * y) / 100,
        angularX: (-1 * x) / 20,
        stopSpeedChasis: stopSpeedChasis,
        pitch_angle: 0,
        yaw_angle: 0,
        stopSpeedGimbal: 0,
      };
      break;
  }
  if (degree !== undefined || null) {
    if (degree.angularX !== 0 || degree.linearX !== 0 || degree.linearY !== 0) {
      robot.setPositionX(degree.linearX * multiplier);
      robot.setAngularX(degree.angularX);
      robot.setPositionY(degree.linearY);
      robot.publishPosition(chassis);

      getAcc(degree.linearX, degree.angularX);

      degree.angularX = 0;
      degree.linearX = 0;
      degree.linearY = 0;
    }

    if (degree.pitch_angle !== 0 || degree.yaw_angle !== 0) {
      robot.setGimbal(degree.pitch_angle);
      robot.setGimbalAngular(degree.yaw_angle);
      robot.publishGimbal(gimbal);
    }
    if (degree.stopSpeedChasis === 1) {
      console.log(multiplier);
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

// ONLY FOR TESTING PURPOSES
export const robotData = new RobotStatus();
robotData.battery = 65;
robotData.publishBattery("battery-data");

listener.subscribe(function (message) {
  const realImg = message.data.replace(/(^"|"$)/g, "");
  img.src = `data:image/jpeg;base64,${realImg}`;
});

// robotData.setPositionString("(1.44131, 0.0271, 0.0)");
// robotData.setPositionString("(2.44131, 0.0271, 0.0)");

// robotData.setPositionString("(3.44131, 0.0271, 0.0)");

// robotData.setPositionString("(4.44131, 0.0271, 0.0)");

// robotData.setPositionString("(5.44131, 0.0271, 0.0)");

// robotData.pushToPositionArray();
// myChart.update();

let counter = 0;
robotData.setImuString(
  "(0.02131, 0.00574, -1.00938, -0.00654, -0.00937, 0.0098)"
);

robotData.setAttitudeString("(1.0, 1.0, 1.0)");
robotData.setGimbalStatusString("(15.6, 52.4, 17.3, 52.4)");
robotData.setESCStatusString("[0, 0, 0, 0]");
robotData.publishESCStatus("esc-status");
// robotData.setRosbagNames("rosbag-1, rosbag-2, rosbag-3");
robotData.publishRosbagList("rosbag-list");
robotData.publishImu("imu");

// add logic to achieve it!!
robotData.setSelectedRosbag("rosdata, 30");

const rosbagList = document.getElementById("rosbag-list");

let selectedRosbag = undefined;
rosbagList.addEventListener("click", (e) => {
  document.getElementById("dropdownMenuRosbag").innerHTML = e.target.id;
  selectedRosbag = e.target.id;
});
imu.subscribe(function (message) {
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
  if (counter < 50) {
    counter += 1;
  } else {
    robotData.pushToPositionArray();
    counter = 0;
    // myChart.update();
  }
  robotData.publishPosition("position");
});
escSpeed.subscribe(function (message) {
  robotData.setESCSpeedString(message.data);
  robotData.publishESCSpeed("esc-speed");
});

escAngle.subscribe(function (message) {
  robotData.setESCAngleString(message.data);
  robotData.publishESCAngle("esc-angle");
});
escTimestamp.subscribe(function (message) {
  robotData.setESCTimestampString(message.data);
  robotData.publishESCTimestamp("esc-timestamp");
});
escStatus.subscribe(function (message) {
  robotData.setESCStatusString(message.data);
  robotData.publishESCStatus("esc-status");
});
gimbalRead.subscribe(function (message) {
  robotData.setGimbalStatusString(message.data);
  robotData.publishGimbalRead("gimbal-angle");
});

rosbagListTopic.subscribe(function (message) {
  robotData.setRosbagNames(message.data);
  robotData.publishRosbagList("rosbag-list");
});

rosbagTimeTopic.subscribe(function (message) {
  robotData.setSelectedRosbag(message.data);
});
let lineCounter = 2;

let samplingCounter = 0;
// createChart();
function animate() {
  if (myRobot) {
    myRobot.position.z = 2.0;
    if (robotData.position.x) myRobot.position.z = 2 * robotData.position.x;
    if (robotData.position.y) myRobot.position.x = -2 * robotData.position.y;
    if (robotData.attitude.x)
      myRobot.rotation.y = (-1 * (robotData.attitude.x + 180) * Math.PI) / 180;
    if (degree && robot.positionAngularX && robot.positionX) {
      for (let i = 0; i < wheels.length; i++) {
        wheels[i].rotation.x += Math.abs(robot.positionAngularX / 10);
        wheels[i].rotation.x += Math.abs(robot.positionX / 10);
      }
    }

    if (positions) positions[lineCounter * 3 - 1] = 2 * robotData.position.x;
    if (positions) positions[lineCounter * 3 - 3] = -2 * robotData.position.y;
    if (robot.angularX !== 0) samplingCounter++;
    if (robot.angularX !== 0 && samplingCounter === 30) {
      lineGeometry.setDrawRange(0, lineCounter + 1);
      lineCounter += 1;

      positions[lineCounter * 3 - 1] += positions[lineCounter * 3 - 1 - 3];
      positions[lineCounter * 3 - 3] += positions[lineCounter * 3 - 3 - 3];

      samplingCounter = 0;
    }
  }

  if (
    robotData.gimbalStatus.yawAngle &&
    robotData.gimbalStatus.pitchAngle &&
    myRobotTopGun
  ) {
    myRobotTop.rotation.y = (robotData.gimbalStatus.yawAngle * Math.PI) / 180;
    myRobotTopGun.rotation.x =
      (robotData.gimbalStatus.pitchAngle * Math.PI) / 180;

    // if (
    //   (myRobotTopGun.rotation.x < Math.PI / 4 || degree.yaw_angle < 0) &&
    //   (myRobotTopGun.rotation.x > Math.PI / -6 || degree.yaw_angle > 0)
    // )
    //   myRobotTopGun.rotation.x += degree.yaw_angle / 100;
  }

  line.geometry.attributes.position.needsUpdate = true; // required after the first render

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
animate();
