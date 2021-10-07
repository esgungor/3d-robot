const chassisController = {
  x: 0,
  y: 0,
  stopSpeedChasis: 1,
};
let dragStart = null;

const maxDiff = 100;
// const rightJoystickInner;
// const rightJoystickOuter;

let dragStop = false;
let moveFlag = false;
let rightJoystickOuter = null;
let rightJoystickInner = null;
export const createJoystick = () => {
  rightJoystickOuter = document.createElement("div");
  rightJoystickOuter.classList.add("joystick-right-outer");
  rightJoystickOuter.id = "right-outer";

  document.body.append(rightJoystickOuter);
  rightJoystickInner = document.createElement("div");
  rightJoystickInner.id = "right-inner";
  rightJoystickInner.classList.add("joystick-right-inner");

  rightJoystickOuter.appendChild(rightJoystickInner);
};
export const mouseDownHandler = (e) => {
  console.log("Triggered");
  e.preventDefault();
  dragStop = false;
  moveFlag = true;
  let rInner = document.getElementById("right-inner");

  rInner.style.transition = ".0s";
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
  chassisController.stopSpeedChasis = 0;
};

export const move = (e) => {
  if (dragStart === null) return;
  e.preventDefault();
  let rInner = document.getElementById("right-inner");
  rInner.style.transition = ".0s";
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

  rInner.style.transform = `translate3d(${xNew}px, ${yNew}px, 0px)`;

  chassisController.x = xNew;
  chassisController.y = yNew;
};
export const mouseUpHandler = (e) => {
  console.log("Hello ITS ME");

  if (dragStart === null) return;
  let rInner = document.getElementById("right-inner");

  rInner.style.transition = ".2s";
  rInner.style.transform = `translate3d(0px, 0px, 0px)`;

  dragStart = null;
  dragStop = true;
  chassisController.x = 0;
  chassisController.y = 0;
  chassisController.stopSpeedChasis = 1;
};

export const getJoystickState = () => {
  return chassisController;
};
