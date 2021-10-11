class RobotStatus {
  robotID = "NO_ID";
  battery = 100;
  positionArrayX = [];
  positionArrayY = [];

  position = {
    x: 0,
    y: 0,
    z: 0,
  };
  attitude = {
    x: 0,
    y: 0,
    z: 0,
  };

  escSpeed = {
    w1: 0,
    w2: 0,
    w3: 0,
    w4: 0,
  };
  escAngle = {
    w1: 0,
    w2: 0,
    w3: 0,
    w4: 0,
  };
  escTimestamp = {
    w1: 0,
    w2: 0,
    w3: 0,
    w4: 0,
  };
  escStatus = {
    w1: 0,
    w2: 0,
    w3: 0,
    w4: 0,
  };
  subInfo = {
    staticFlag: 0,
    upHill: 0,
    downHill: 0,
    onSlope: 0,
    pickUp: 0,
    slipFlag: 0,
    impactX: 0,
    impactY: 0,
    impactZ: 0,
    rollOver: 0,
    hillStatic: 0,
  };
  imu = {
    accX: 0,
    accY: 0,
    accZ: 0,
    gyroX: 0,
    gyroY: 0,
    gyroZ: 0,
  };

  gimbalStatus = {
    pitchAngle: 0,
    yawAngle: 0,
    pitchGroundAngle: 0,
    yawGroundAngle: 0,
  };

  constructor(robotID, battery, position = { x: 0, y: 0, z: 0 }) {
    this.robotID = robotID;
    this.battery = battery;
    this.position = position;
  }

  getPosition() {
    return this.position;
  }
  pushToPositionArray() {
    const { x, y, z } = this.position;

    if (this.positionArrayY.length >= 5) this.positionArrayY.shift();
    if (this.positionArrayX.length >= 5) this.positionArrayX.shift();

    this.positionArrayY.push(y);
    this.positionArrayX.push(x);
  }

  setPosition(x, y, z) {
    this.position.x = parseFloat(x);
    this.position.y = parseFloat(y);
    this.position.z = parseFloat(z);
  }
  setAttitude(x, y, z) {
    this.attitude.x = parseFloat(x);
    this.attitude.y = parseFloat(y);
    this.attitude.z = parseFloat(z);
  }
  setSubInfo(
    staticFlag,
    upHill,
    downHill,
    onSlope,
    pickUp,
    slipFlag,
    impactX,
    impactY,
    impactZ,
    rollOver,
    hillStatic
  ) {
    this.subInfo.staticFlag = staticFlag;
    this.subInfo.upHill = upHill;
    this.subInfo.downHill = downHill;
    this.subInfo.onSlope = onSlope;
    this.subInfo.pickUp = pickUp;
    this.subInfo.slipFlag = slipFlag;
    this.subInfo.impactX = impactX;
    this.subInfo.impactY = impactY;
    this.subInfo.impactZ = impactZ;
    this.subInfo.rollOver = rollOver;
    this.subInfo.hillStatic = hillStatic;
  }
  setGimbalStatus(pitchAngle, yawAngle, pitchGroundAngle, yawGroundAngle) {
    this.gimbalStatus.pitchAngle = parseFloat(pitchAngle);
    this.gimbalStatus.yawAngle = parseFloat(yawAngle);
    this.gimbalStatus.pitchGroundAngle = parseFloat(pitchGroundAngle);
    this.gimbalStatus.yawGroundAngle = parseFloat(yawGroundAngle);
  }
  setImu(accX, accY, accZ, gyroX, gyroY, gyroZ) {
    this.imu.accX = parseFloat(accX).toFixed(2);
    this.imu.accY = parseFloat(accY).toFixed(2);
    this.imu.accZ = parseFloat(accZ).toFixed(2);
    this.imu.gyroX = parseFloat(gyroX).toFixed(2);
    this.imu.gyroY = parseFloat(gyroY).toFixed(2);
    this.imu.gyroZ = parseFloat(gyroZ).toFixed(2);
  }

  setESCSpeed(w1, w2, w3, w4) {
    this.escSpeed.w1 = parseInt(w1);
    this.escSpeed.w2 = parseInt(w2);
    this.escSpeed.w3 = parseInt(w3);
    this.escSpeed.w4 = parseInt(w4);
  }

  setESCAngle(w1, w2, w3, w4) {
    this.escAngle.w1 = parseInt(w1);
    this.escAngle.w2 = parseInt(w2);
    this.escAngle.w3 = parseInt(w3);
    this.escAngle.w4 = parseInt(w4);
  }

  setESCTimestamp(w1, w2, w3, w4) {
    this.escTimestamp.w1 = parseInt(w1);
    this.escTimestamp.w2 = parseInt(w2);
    this.escTimestamp.w3 = parseInt(w3);
    this.escTimestamp.w4 = parseInt(w4);
  }

  setESCStatus(w1, w2, w3, w4) {
    this.escStatus.w1 = parseInt(w1);
    this.escStatus.w2 = parseInt(w2);
    this.escStatus.w3 = parseInt(w3);
    this.escStatus.w4 = parseInt(w4);
  }
  setBattery(percent) {
    this.battery = parseInt(percent);
  }

  publishBattery(elementID) {
    let htmlObject = document.getElementById(elementID);

    let batteryIcon = "full";
    if (this.battery > 75) batteryIcon = "full";
    else if (this.battery > 50) batteryIcon = "three-quarters";
    else if (this.battery > 25) batteryIcon = "half";
    else if (this.battery > 0) batteryIcon = "quarter";
    htmlObject.innerHTML = `<span id="battery-data" class="text-success me-1">${this.battery}%</span><i class="text-success fas fa-battery-${batteryIcon} fa-lg"></i>`;
  }
  publishRobotID(elementID) {
    let htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `${this.robotID}`;
  }
  publishPosition(elementID) {
    let htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `<strong>X</strong>:${this.position.x} <strong>Y</strong>:${this.position.y} <strong>Z</strong>:${this.position.z}`;
  }
  publishAttitude(elementID) {
    let htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `<strong>X</strong>:${this.attitude.x} <strong>Y</strong>:${this.attitude.y} <strong>Z</strong>:${this.attitude.z}`;
  }
  publishImu(elementID) {
    let htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `<strong>AccX</strong>: ${this.imu.accX} <strong>AccY</strong>: ${this.imu.accY} <strong>AccZ</strong>: ${this.imu.accZ}</br><strong>GyroX</strong>: ${this.imu.gyroX} <strong>GyroY</strong>: ${this.imu.gyroY} <strong>GyroZ</strong>: ${this.imu.gyroZ}`;
  }
  publishSubInfo(elementID) {
    let htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `<strong>AccX</strong>: ${this.subInfo.staticFlag} <strong>AccY</strong>: ${this.subInfo.upHill} <strong>AccZ</strong>: ${this.subInfo.downHill}</br>`;
  }

  publishGimbalRead(elementID) {
    let htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `<strong>Pitch Angle: </strong>${this.gimbalStatus.pitchAngle}<br /><strong>Yaw Angle: </strong>${this.gimbalStatus.yawAngle}<br /><strong>Pitch Ground Angle:</strong> ${this.gimbalStatus.pitchGroundAngle}<br /><strong>Yaw Ground Angle:</strong> ${this.gimbalStatus.pitchGroundAngle}`;
  }
  publishESCSpeed(elementID) {
    const htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `<strong>W1: </strong>${this.escSpeed.w1} <strong>W2: </strong>${this.escSpeed.w2} <strong>W3: </strong>${this.escSpeed.w3}<strong> W4: </strong>${this.escSpeed.w4}`;
  }
  publishESCAngle(elementID) {
    const htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `<strong>W1: </strong>${this.escAngle.w1} <strong>W2: </strong>${this.escAngle.w2} <strong>W3: </strong>${this.escAngle.w3}<strong> W4: </strong>${this.escAngle.w4}`;
  }
  publishESCTimestamp(elementID) {
    const htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `<strong>W1: </strong>${this.escTimestamp.w1} <strong>W2: </strong>${this.escTimestamp.w2} <strong>W3: </strong>${this.escTimestamp.w3}<strong> W4: </strong>${this.escTimestamp.w4}`;
  }
  publishESCStatus(elementID) {
    const htmlObject = document.getElementById(elementID);
    htmlObject.innerHTML = `<strong>W1: </strong>${this.escStatus.w1} <strong>W2: </strong>${this.escStatus.w2} <strong>W3: </strong>${this.escStatus.w3}<strong> W4: </strong>${this.escStatus.w4}`;
  }
  setESCAngleString(escStr) {
    escStr = escStr.replace("[", "");
    escStr = escStr.replace("]", "");
    const [w1, w2, w3, w4] = escStr.split(", ");

    this.setESCAngle(w1, w2, w3, w4);
  }
  setESCTimestampString(escStr) {
    escStr = escStr.replace("[", "");
    escStr = escStr.replace("]", "");

    const [w1, w2, w3, w4] = escStr.split(", ");
    console.log(w1);

    this.setESCTimestamp(w1, w2, w3, w4);
  }
  setESCStatusString(escStr) {
    escStr = escStr.replace("[", "");
    escStr = escStr.replace("]", "");
    const [w1, w2, w3, w4] = escStr.split(", ");

    this.setESCStatus(w1, w2, w3, w4);
  }
  setESCSpeedString(escStr) {
    escStr = escStr.replace("[", "");
    escStr = escStr.replace("]", "");
    const [w1, w2, w3, w4] = escStr.split(", ");

    this.setESCSpeed(w1, w2, w3, w4);
  }

  setPositionString(positionStr) {
    positionStr = positionStr.replace("[", "");
    positionStr = positionStr.replace("]", "");
    let [x, y, z] = positionStr.split(", ");
    // console.log(x);
    this.setPosition(x, y, z);
  }
  setImuString(positionStr) {
    positionStr = positionStr.replace("[", "");
    positionStr = positionStr.replace("]", "");
    let [accX, accY, accZ, gyroX, gyroY, gyroZ] = positionStr.split(", ");
    this.setImu(accX, accY, accZ, gyroX, gyroY, gyroZ);
  }
  setAttitudeString(positionStr) {
    positionStr = positionStr.replace("[", "");
    positionStr = positionStr.replace("]", "");
    let [x, y, z] = positionStr.split(", ");
    this.setAttitude(x, y, z);
  }
  setSubInfoString(positionStr) {
    positionStr = positionStr.replace("[", "");
    positionStr = positionStr.replace("]", "");
    let [
      staticFlag,
      upHill,
      downHill,
      onSlope,
      pickUp,
      slipFlag,
      impactX,
      impactY,
      impactZ,
      rollOver,
      hillStatic,
    ] = positionStr.split(", ");
    this.setAttitude(
      staticFlag,
      upHill,
      downHill,
      onSlope,
      pickUp,
      slipFlag,
      impactX,
      impactY,
      impactZ,
      rollOver,
      hillStatic
    );
  }
  setGimbalStatusString(positionStr) {
    positionStr = positionStr.replace("[", "");
    positionStr = positionStr.replace("]", "");
    let [pitchAngle, yawAngle, pitchGroundAngle, yawGroundAngle] =
      positionStr.split(", ");
    this.setGimbalStatus(
      pitchAngle,
      yawAngle,
      pitchGroundAngle,
      yawGroundAngle
    );
  }
}

export default RobotStatus;
