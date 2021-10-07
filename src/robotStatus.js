class RobotStatus {
  robotID = "NO_ID";
  battery = 100;
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
