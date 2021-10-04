const refreshRate = 250;
var stopSpeedChasis = 0;
var stopSpeedGimbal = 0;

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
  stopSpeedChasis: 0,
  pitch_angle: 0,
  yaw_angle: 0,
  stopSpeedGimbal: 0,
};
const round10 = (value, exp) => decimalAdjust("round", value, exp);

export function getGamepadState() {
  // Returns up to 4 gamepads.
  const gamepads = navigator.getGamepads();

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
      console.log(button);
      console.log(`Button ${button.id} was pressed.`);
    }
  }
  return logs;

  // Print the pressed buttons to our HTML
}

function isPressed({ button: { pressed } }) {
  return !!pressed;
}
