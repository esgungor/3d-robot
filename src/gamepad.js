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

const round10 = (value, exp) => decimalAdjust("round", value, exp);

export function getGamepadState() {
  // Returns up to 4 gamepads.
  const gamepads = navigator.getGamepads();

  // We take the first one, for simplicity
  const gamepad = gamepads[0];

  // Escape if no gamepad was found
  if (!gamepad) {
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
      console.log(angularX, linearX, stopSpeedChasis);
      return { angularX, linearX };
      stopSpeedChasis = 1;
    } else {
      if (stopSpeedChasis == 1) {
        linearX = 0;
        angularX = 0;
        console.log("SpeedStop:", angularX, linearX, stopSpeedChasis);
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
      console.log(pitch_angle, yaw_angle, stopSpeedGimbal);
      log(pitch_angle, yaw_angle, stopSpeedGimbal);
      gimbal.linear.x = yaw_angle * 60;
      gimbal.angular.x = pitch_angle * -1 * 60;
      gimbalVel.publish(gimbal);
      stopSpeedGimbal = 1;
    } else {
      if (stopSpeedGimbal == 1) {
        yaw_angle = 0;
        pitch_angle = 0;
        console.log("SpeedStop:", pitch_angle, yaw_angle, stopSpeedGimbal);
        console.log("SpeedStop:", pitch_angle, yaw_angle);
        gimbal.linear.x = yaw_angle;
        gimbal.angular.x = pitch_angle;
        gimbalVel.publish(gimbal);
        stopSpeedGimbal = 0;
      }
    }
  }

  // Print the pressed buttons to our HTML
}

function isPressed({ button: { pressed } }) {
  return !!pressed;
}
