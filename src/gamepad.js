import { blasterTrigger } from "./additionalTopic";
import { decreaseMultiplier, increaseMultiplier, ros } from "./script";

const refreshRate = 250;
var stopSpeedChasis = 0;
var stopSpeedGimbal = 0;
var deneme = 0;

//last pressed button for axis control
var pressedID = 0;

let xAxis = document.getElementById("x-axis");
let yAxis = document.getElementById("y-axis");
export const getAcc = (x, y) => {
  xAxis.style.width = `${Math.abs(x) * 100}%`;
  yAxis.style.width = `${Math.abs(y) * 100}%`;
};

function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === "undefined" || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split("e");
  value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
}

const logs = {
  angularX: 0,
  linearX: 0,
  linearY: 0,
  stopSpeedChasis: 0,
  pitch_angle: 0,
  yaw_angle: 0,
  stopSpeedGimbal: 0,
};
const round10 = (value, exp) => decimalAdjust("round", value, exp);

export function getGamepadState() {
  // Returns up to 4 gamepads.
  const gamepads = navigator.getGamepads();
  let speed = 0.5;
  // We take the first one, for simplicity
  const gamepad = gamepads[0];

  // Escape if no gamepad was found
  if (!gamepad) {
    console.log("gamepad disabled");
    return;
  }
  // Filter out only the buttons which are pressed
  const pressedButtons = gamepad.buttons
    .map((button, id) => ({ id, button }))
    .filter(isPressed);
  const linearYMove = gamepad.buttons
    .map((button, id) => ({ id, button }))
    .filter((obj) => obj.id === 5 || obj.id === 4);
  //Left
  if (gamepads[0].axes[0] || gamepads[0].axes[1]) {
    var linearX = round10(gamepads[0].axes[1] * -1, -1);
    var angularX = round10(gamepads[0].axes[0] * -1, -1);
    if (
      linearX > 0.15 ||
      linearX < -0.15 ||
      angularX > 0.15 ||
      angularX < -0.15
    ) {
      stopSpeedChasis = 1;
      logs.angularX = angularX;
      logs.linearX = linearX;
    } else {
      if (stopSpeedChasis === 1) {
        linearX = 0;
        angularX = 0;
        stopSpeedChasis = 0;

        logs.angularX = angularX;
        logs.linearX = linearX;
        logs.stopSpeedChasis = 1;
      }
    }
  }
  if (gamepads[0].axes[2] || gamepads[0].axes[3]) {
    var yaw_angle = round10(gamepads[0].axes[3] * -1, -1);
    var pitch_angle = round10(gamepads[0].axes[2] * -1, -1);
    if (
      yaw_angle > 0.15 ||
      yaw_angle < -0.15 ||
      pitch_angle > 0.15 ||
      pitch_angle < -0.15
    ) {
      // console.log(pitch_angle, yaw_angle, stopSpeedGimbal);
      stopSpeedGimbal = 1;
      logs.pitch_angle = pitch_angle;
      logs.yaw_angle = yaw_angle;
    } else {
      if (stopSpeedGimbal === 1) {
        yaw_angle = 0;
        pitch_angle = 0;
        logs.pitch_angle = pitch_angle;
        logs.yaw_angle = yaw_angle;
        stopSpeedGimbal = 0;

        logs.stopSpeedGimbal = 1;
      }
    }
    for (const button of pressedButtons) {
      // its not good option to CALL ROS CONNECTION HERE!!
      if (button.id === 11) {
        blasterTrigger(ros, { data: "1" });
      }
      if (button.id === 12) {
        increaseMultiplier();
      }
      if (button.id === 13) {
        decreaseMultiplier();
      }
    }

    for (const button of linearYMove) {
      // its not good option to CALL ROS CONNECTION HERE!!
      // if (button.id === 5 && !button.button.pressed) {
      //   console.log(button);
      // }
      if (button.button.pressed) {
        console.log("çalıştım");
        if (button.id === 5) {
          logs.linearY = 1.0;
          pressedID = 5;
        }
        if (button.id === 4) {
          logs.linearY = -1.0;
          pressedID = 4;
        }
        deneme = 1;
      } else if (button.id === pressedID && !button.button.pressed) {
        if (deneme === 1) {
          logs.linearY = 0.0;
          deneme = 0;
          logs.stopSpeedChasis = 1;
          console.log("durdum");
        }
      }
    }
  }
  return logs;

  // Print the pressed buttons to our HTML
}

function isPressed({ button: { pressed } }) {
  return !!pressed;
}
